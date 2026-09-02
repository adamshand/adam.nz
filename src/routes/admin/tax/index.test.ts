import { describe, expect, it } from 'vitest'

import { getGstPeriod, getTaxYear, getTaxYearStartEndDates, isInTaxYear } from '.'

describe('NZ financial year helpers', () => {
	it('starts the tax year on 1 April, not in March', () => {
		expect(getTaxYear(new Date(2026, 2, 31))).toBe(2025)
		expect(getTaxYear(new Date(2026, 3, 1))).toBe(2026)
	})

	it('uses 1 April to 31 March boundaries', () => {
		expect(getTaxYearStartEndDates(2025)).toEqual({
			start: '2025-04-01',
			middle: '2025-10-01',
			end: '2026-03-31',
		})
	})

	it('includes only paid dates inside the selected financial year', () => {
		expect(isInTaxYear('2025-04-01', 2025)).toBe(true)
		expect(isInTaxYear('2026-03-31', 2025)).toBe(true)
		expect(isInTaxYear('2026-04-01', 2025)).toBe(false)
		expect(isInTaxYear('2026-04-07', 2025)).toBe(false)
	})

	it('splits GST periods at 1 October', () => {
		expect(getGstPeriod('2025-09-30', 2025)).toBe(0)
		expect(getGstPeriod('2025-10-01', 2025)).toBe(1)
	})
})
