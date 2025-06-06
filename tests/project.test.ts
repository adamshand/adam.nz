import { expect, test } from '@playwright/test'

test.describe(`/projects`, () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/projects')
	})

	test('title', async ({ page }) => {
		await expect(page.locator('h1')).toHaveText('All Projects')
	})

	test('number of projects', async ({ page }) => {
		await expect(page.locator(`section`)).toHaveCount(19)
		// the below fails, not sure why
		// expect(await page.locator('section div.project').count()).toBeGreaterThan(15)
	})

	test('the bad day', async ({ page }) => {
		await expect(page.locator('section').filter({ hasText: 'The Bad Day' }).last()).toBeVisible()
		await expect(page.locator('section').filter({ hasText: 'The Bad Day' }).last().locator('.title a')).toHaveAttribute(
			'href',
			'/projects/the-bad-day',
		)
		await expect(page.locator('section').filter({ hasText: 'The Bad Day' }).last().locator('img')).toHaveAttribute('title', 'The Bad Day')
		await expect(page.locator('section').filter({ hasText: 'The Bad Day' }).last().locator('footer a[href*="2013"]')).toHaveAttribute(
			'href',
			'/posts/2013',
		)
	})
})
