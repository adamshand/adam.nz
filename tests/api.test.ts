import { expect, test } from '@playwright/test'

test('/api/quote?id=random', async ({ request }) => {
	const response = await request.get(`/api/quote?id=random`)
	expect(response.status()).toBe(200)
	const body = await response.text()
	expect(body).toMatch(/.*\n\n— +[A-z].*/)
})
