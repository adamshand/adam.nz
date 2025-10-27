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

const { start, end } = getTaxYearStartEndDates()
console.log(`Tax Year: ${start} to ${end}`)


export const load = async () => {
  const { start, end } = getTaxYearStartEndDates()

  const params = new URLSearchParams({
    from: start,
    to: end
  })

  const json = await fetch(`https://api.harvestapp.com/v2/invoices?${params}`, {
    headers: {
      'Harvest-Account-ID': env.HARVEST_ID,
      'Authorization': `Bearer ${env.HARVEST_KEY}`,
      'User-Agent': 'TaxCalc (adam@haume.nz)'
    }
  }).then(x => x.json())


  const invoices = json.invoices.filter((invoice: any) => invoice.state == 'paid')
  return { invoices, taxYear: getTaxYear() }
}

