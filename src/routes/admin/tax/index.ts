export type Invoice = {
  amount: number
  client: { name: string, id: number }
  currency: string
  gstPeriod: number
  id: number
  amountWithoutGst: number
  paid_at: string
  paid_date: string
  tax_amount: number
  state: string
}

export function getTaxYear(today = new Date()): number {
  return today.getMonth() >= 2 ? today.getFullYear() : today.getFullYear() - 1
}

export function getTaxYearStartEndDates(year = getTaxYear()) {
  return {
    start: `${year}-04-01`,
    middle: `${year}-10-01`,
    end: `${year + 1}-03-31`
  }
}

export function calculateTax(yearlyIncomeToDate: number | string) {
  const brackets = [
    { threshold: 15600, rate: 0.105 },
    { threshold: 53500, rate: 0.175 },
    { threshold: 78100, rate: 0.3 },
    { threshold: 180000, rate: 0.33 },
    { threshold: Infinity, rate: 0.39 },
  ]

  let remaining = Number(yearlyIncomeToDate)
  let tax = 0
  let prevThreshold = 0

  for (const bracket of brackets) {
    const taxable = Math.min(remaining, bracket.threshold - prevThreshold)
    if (taxable <= 0) break
    tax += taxable * bracket.rate
    remaining -= taxable
    prevThreshold = bracket.threshold
  }

  return tax
}