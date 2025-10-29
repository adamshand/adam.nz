import { env } from '$env/dynamic/private';
import { type Invoice, calculateTax, getTaxYear, getTaxYearStartEndDates } from '.';

export const load = async () => {
	const taxYear = getTaxYear()
	const { start, middle, end } = getTaxYearStartEndDates()

	const params = new URLSearchParams({
		from: start,
		to: end,
		per_page: '1000',
		state: 'paid'
	})

	const json = await fetch(`https://api.harvestapp.com/v2/invoices?${params}`, {
		headers: {
			'Harvest-Account-ID': env.HARVEST_ID,
			'Authorization': `Bearer ${env.HARVEST_KEY}`,
			'User-Agent': 'TaxCalc (adam@haume.nz)'
		}
	}).then(x => x.json())

	// consider updating load function to use payments api https://help.getharvest.com/api-v2/invoices-api/invoices/invoice-payments/

	const invoices = json.invoices
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
		}))

	const yearlyIncome = invoices.reduce((sum: number, i: any) => sum + Number(i.amountWithoutGst), 0)
	const yearlyIncomeTax = calculateTax(yearlyIncome)

	return {
		invoices,
		taxYear,
		yearly: {
			gst: invoices.reduce((sum: number, i: any) => sum + Number(i.tax_amount), 0),
			income: yearlyIncome,
			revenue: invoices.reduce((sum: number, i: any) => sum + Number(i.amount), 0),
			tax: yearlyIncomeTax,
			taxRate: yearlyIncomeTax / yearlyIncome * 100 + '%'
		}
	}
}

// console.log({ yearlyGst, yearlyIncome, yearlyRevenue })
// console.log(invoices.forEach(x => console.log(x.paid_at, x.gst_period)))
// const octFirst = `${taxYear}-10-01`;
// const aprToSep = invoices.filter((i: any) => i.paid_at?.slice(0, 10) < octFirst);
// const onOrAfterOct = invoices.filter((i: any) => i.paid_at?.slice(0, 10) >= octFirst);


