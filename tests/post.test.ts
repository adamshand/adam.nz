import { expect, test } from '@playwright/test'

test.describe(`/questionnaire`, () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/questionnaire')
	})

	test('title', async ({ page }) => {
		await expect(page.locator('h1.title')).toHaveText('Questionnaire by Wendell Berry')
		await expect(page.locator('h1.title >> a').getAttribute('href')).resolves.toMatch(
			'/search/by/Wendell Berry',
		)
	})

	test('aside', async ({ page }) => {
		await expect(page.locator('#aside p')).toHaveText('From Leavings.')
		await expect(page.locator('#library p:first-of-type')).toContainText('struck a chord')
	})

	test('meta', async ({ page }) => {
		await expect(page.locator('.meta')).toContainText('archive posted on 14 Feb 2024 in')
		await expect(page.locator('.meta > #category > a')).toHaveAttribute('href', '/posts/archive')
		await expect(page.locator('.meta > #created')).toHaveAttribute('href', '/posts/2024')
		await expect(page.locator('.meta > .tags a:nth-of-type(1)')).toHaveAttribute(
			'href',
			'/search/tag/crying',
		)
	})
})
