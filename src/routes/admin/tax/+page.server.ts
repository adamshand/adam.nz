import { env } from '$env/dynamic/private'
import {
	type Invoice,
	calculateTax,
	getGstPeriod,
	getTaxYear,
	getTaxYearStartEndDates,
	isInTaxYear,
} from '.'
import type { PageServerLoad } from './$types'

const taxYearLabel = (year: number) => `${year}/${String(year + 1).slice(-2)}`
const toMoney = (amount: number | null | undefined) => Math.round((Number(amount) || 0) * 100) / 100

const gstAdjustments = [
	{
		taxYear: 2025,
		gstPeriod: 1,
		amount: 57.39,
		description: 'One-off 2025/26 Oct-Mar GST filing adjustment to match myIR/records',
	},
]

const harvestHeaders = {
	'Harvest-Account-ID': env.HARVEST_ID,
	Authorization: `Bearer ${env.HARVEST_KEY}`,
	'User-Agent': 'TaxCalc (adam@haume.nz)',
}

async function fetchHarvestInvoices(params: URLSearchParams) {
	const invoices: Invoice[] = []
	let page = 1
	let totalPages = 1

	do {
		params.set('page', String(page))
		const json = await fetch(`https://api.harvestapp.com/v2/invoices?${params}`, {
			headers: harvestHeaders,
		}).then((x) => x.json())

		invoices.push(...(json.invoices ?? []))
		totalPages = json.total_pages ?? page
		page += 1
	} while (page <= totalPages)

	return invoices
}

export const load: PageServerLoad = async ({ url }) => {
	const currentTaxYear = getTaxYear()
	const defaultTaxYear = currentTaxYear - 1
	const requestedTaxYear = url.searchParams.get('year')
	const parsedTaxYear = requestedTaxYear ? Number(requestedTaxYear) : NaN
	const taxYear = Number.isInteger(parsedTaxYear) ? parsedTaxYear : defaultTaxYear
	const { end } = getTaxYearStartEndDates(taxYear)
	// Harvest's from/to filters issue_date, not paid_date. Fetch all historical paid invoices
	// up to the selected year end, then apply the tax-year filter to paid_date below.
	const harvestQueryStart = '2000-01-01'
	const taxYears = Array.from({ length: 10 }, (_, index) => currentTaxYear - index).map((year) => ({
		year,
		label: taxYearLabel(year),
	}))

	const params = new URLSearchParams({
		from: harvestQueryStart,
		to: end,
		per_page: '2000',
		state: 'paid',
	})

	// consider updating load function to use payments api https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-payments/

	const harvestInvoices = await fetchHarvestInvoices(params)

	const invoices = harvestInvoices
		.filter((i: Invoice) => isInTaxYear(i.paid_date, taxYear))
		.sort((a: Invoice, b: Invoice) => a.paid_date.localeCompare(b.paid_date))
		.map((i: Invoice) => {
			const amount = toMoney(i.amount)
			const taxAmount = toMoney(i.tax_amount)

			return {
				client: { name: i.client.name, id: i.client.id },
				currency: i.currency,
				amount,
				tax_amount: taxAmount,
				gstPeriod: getGstPeriod(i.paid_date, taxYear),
				id: i.id,
				amountWithoutGst: toMoney(amount - taxAmount),
				paid_at: i.paid_at,
				state: i.state,
				paid_date: i.paid_date,
			}
		})

	const selectedGstAdjustments = gstAdjustments.filter(
		(adjustment) => adjustment.taxYear === taxYear,
	)
	const gstAdjustmentTotal = selectedGstAdjustments.reduce(
		(sum, adjustment) => sum + adjustment.amount,
		0,
	)
	const harvestGst = invoices.reduce((sum: number, i: Invoice) => sum + Number(i.tax_amount), 0)
	const harvestIncome = invoices.reduce(
		(sum: number, i: Invoice) => sum + Number(i.amountWithoutGst),
		0,
	)
	const yearlyIncome = harvestIncome - gstAdjustmentTotal
	const yearlyIncomeTax = calculateTax(yearlyIncome)
	const taxRate = yearlyIncome > 0 ? `${(yearlyIncomeTax / yearlyIncome) * 100}%` : '0%'

	return {
		invoices,
		gstAdjustments: selectedGstAdjustments,
		taxYear,
		taxYearLabel: taxYearLabel(taxYear),
		taxYears,
		yearly: {
			gst: harvestGst + gstAdjustmentTotal,
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
