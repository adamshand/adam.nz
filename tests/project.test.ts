import { expect, test } from '@playwright/test'

test.describe(`/projects`, () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/projects')
	})

	test('title', async ({ page }) => {
		await expect(page.locator('h1')).toHaveText('All Projects')
	})

	test('number of projects', async ({ page }) => {
		await expect(page.locator(`section div.project`)).toHaveCount(18)
		// the below fails, not sure why
		// expect(await page.locator('section div.project').count()).toBeGreaterThan(15)
	})

	test('the bad day', async ({ page }) => {
		await expect(page.locator('#TheBadDay')).toContainText('The Bad Day')
		await expect(page.locator('#TheBadDay > div > a')).toHaveAttribute(
			'href',
			'/projects/the-bad-day',
		)
		await expect(page.locator('#TheBadDay > div > a > img')).toHaveAttribute('title', 'The Bad Day')
		await expect(page.locator('#TheBadDay > .posted > .meta > a')).toHaveAttribute(
			'href',
			'/posts/2013',
		)
	})
})
