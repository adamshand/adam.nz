import { expect, test } from '@playwright/test'

test.describe(`indexes`, () => {
	test('/posts/2015', async ({ page }) => {
		await page.goto('/posts/2015')
		await expect(page.locator('h1')).toHaveText('2015')
		await expect(page.locator(`main div:first-child span`)).toHaveCount(30)
		await expect(page.locator(`.post`)).toHaveCount(5)
	})

	test('/posts/vignette', async ({ page }) => {
		await page.goto('/posts/vignette')
		await expect(page.locator('h1')).toHaveText('vignettes')
		await expect(page.locator(`h2`)).toHaveCount(3)
		// await expect(page.locator('section.post')).toHaveCount(6)
		// await expect(page.locator('#posts h2:nth-of-type(2) > a')).toHaveAttribute(
		// 	'href',
		// 	'/posts/2012',
		// )
	})
})
