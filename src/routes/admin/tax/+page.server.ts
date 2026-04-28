import { env } from '$env/dynamic/private'
import { type Invoice, calculateTax, getTaxYear, getTaxYearStartEndDates } from '.'
import type { PageServerLoad } from './$types'

const taxYearLabel = (year: number) => `${year}/${String(year + 1).slice(-2)}`

export const load: PageServerLoad = async ({ url }) => {
	const currentTaxYear = getTaxYear()
	const defaultTaxYear = currentTaxYear - 1
	const requestedTaxYear = url.searchParams.get('year')
	const parsedTaxYear = requestedTaxYear ? Number(requestedTaxYear) : NaN
	const taxYear = Number.isInteger(parsedTaxYear) ? parsedTaxYear : defaultTaxYear
	const { start, middle, end } = getTaxYearStartEndDates(taxYear)
	const harvestQueryStart = getTaxYearStartEndDates(taxYear - 1).start
	const taxYears = Array.from({ length: 10 }, (_, index) => currentTaxYear - index).map((year) => ({
		year,
		label: taxYearLabel(year),
	}))

	const params = new URLSearchParams({
		from: harvestQueryStart,
		to: end,
		per_page: '1000',
		state: 'paid',
	})

	const json = await fetch(`https://api.harvestapp.com/v2/invoices?${params}`, {
		headers: {
			'Harvest-Account-ID': env.HARVEST_ID,
			Authorization: `Bearer ${env.HARVEST_KEY}`,
			'User-Agent': 'TaxCalc (adam@haume.nz)',
		},
	}).then((x) => x.json())

	// consider updating load function to use payments api https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-payments/

	const invoices = (json.invoices ?? [])
		.filter((i: Invoice) => i.paid_date >= start && i.paid_date <= end)
		.sort((a: Invoice, b: Invoice) => a.paid_at.localeCompare(b.paid_at))
		.map((i: Invoice) => ({
			client: { name: i.client.name, id: i.client.id },
			currency: i.currency,
			amount: i.amount.toFixed(2),
			tax_amount: i.tax_amount.toFixed(2),
			gstPeriod: i.paid_date < middle ? 0 : 1,
			id: i.id,
			amountWithoutGst: (i.amount - i.tax_amount).toFixed(2),
			paid_at: i.paid_at,
			state: i.state,
			paid_date: i.paid_date,
		}))

	const yearlyIncome = invoices.reduce(
		(sum: number, i: Invoice) => sum + Number(i.amountWithoutGst),
		0,
	)
	const yearlyIncomeTax = calculateTax(yearlyIncome)
	const taxRate = yearlyIncome > 0 ? `${(yearlyIncomeTax / yearlyIncome) * 100}%` : '0%'

	return {
		invoices,
		taxYear,
		taxYearLabel: taxYearLabel(taxYear),
		taxYears,
		yearly: {
			gst: invoices.reduce((sum: number, i: Invoice) => sum + Number(i.tax_amount), 0),
			income: yearlyIncome,
			revenue: invoices.reduce((sum: number, i: Invoice) => sum + Number(i.amount), 0),
			tax: yearlyIncomeTax,
			taxRate,
		},
	}
}

// console.log({ yearlyGst, yearlyIncome, yearlyRevenue })
// console.log(invoices.forEach(x => console.log(x.paid_at, x.gst_period)))
// const octFirst = `${taxYear}-10-01`;
// const aprToSep = invoices.filter((i: any) => i.paid_at?.slice(0, 10) < octFirst);
// const onOrAfterOct = invoices.filter((i: any) => i.paid_at?.slice(0, 10) >= octFirst);
