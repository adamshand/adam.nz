import { env } from '$env/dynamic/private';

function getTaxYear(today = new Date()): number {
	return today.getMonth() >= 2 ? today.getFullYear() : today.getFullYear() - 1
}

function getTaxYearStartEndDates(year = getTaxYear()) {
	return {
		// start: new Date(`${year}-04-01`),
		// end: new Date(`${year + 1}-03-31`)
		start: `${year}-04-01`,
		end: `${year + 1}-03-31`
	}
}

export const load = async () => {
	const taxYear = getTaxYear()
	const { start, end } = getTaxYearStartEndDates()
	// console.log(`Tax Year: ${start} to ${end}`)

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

	const invoices = json.invoices.sort((a: any, b: any) => a.paid_at.localeCompare(b.paid_at))

	const octFirst = `${taxYear}-10-01`;
	const aprToSep = invoices.filter((i: any) => i.paid_at?.slice(0, 10) < octFirst);
	const onOrAfterOct = invoices.filter((i: any) => i.paid_at?.slice(0, 10) >= octFirst);

	return {
		taxYear,
		invoices: { aprToSep, onOrAfterOct, }
	}
}
