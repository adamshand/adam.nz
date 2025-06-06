import { expect, test } from '@playwright/test'

test.describe(`/questionnaire`, () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/questionnaire')
	})

	test('title', async ({ page }) => {
		await expect(page.locator('h1')).toHaveText('Questionnaire by Wendell Berry')
		await expect(page.locator('h1 #author a').getAttribute('href')).resolves.toMatch(
			'/search/by/Wendell Berry',
		)
	})

	test('aside', async ({ page }) => {
		await expect(page.locator('aside p').first()).toHaveText('From Leavings.')
		await expect(page.locator('aside p').nth(1)).toContainText('struck a chord')
	})

	test('meta', async ({ page }) => {
		await expect(page.locator('footer.overline')).toContainText('archive Posted on 14 Feb 2024')
		await expect(page.locator('footer.overline .category a')).toHaveAttribute('href', '/posts/archive')
		await expect(page.locator('footer.overline #created')).toHaveAttribute('href', '/posts/2024')
		await expect(page.locator('footer.overline a[href*="/search/tag/crying"]')).toHaveAttribute(
			'href',
			'/search/tag/crying',
		)
	})
})
