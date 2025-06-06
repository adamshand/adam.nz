import { expect, test } from '@playwright/test'

test.describe('WebFinger endpoint', () => {
	test('should return valid response for kiaora@adam.nz', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=acct:kiaora@adam.nz')
		
		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('application/jrd+json')
		
		const body = await response.json()
		expect(body.subject).toBe('acct:kiaora@adam.nz')
		expect(body.aliases).toContain('https://adam.nz')
		expect(body.aliases).toContain('https://adam.shand.net')
		expect(body.links).toHaveLength(3)
		
		const profileLink = body.links.find((link: any) => link.rel === 'http://webfinger.net/rel/profile-page')
		expect(profileLink).toBeDefined()
		expect(profileLink.href).toBe('https://adam.nz')
		
		const avatarLink = body.links.find((link: any) => link.rel === 'http://webfinger.net/rel/avatar')
		expect(avatarLink).toBeDefined()
		expect(avatarLink.href).toBe('https://adam.nz/avatar.jpg')
	})

	test('should return valid response for adam@shand.net', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=acct:adam@shand.net')
		
		expect(response.status()).toBe(200)
		const body = await response.json()
		expect(body.subject).toBe('acct:kiaora@adam.nz')
	})

	test('should handle resource without acct: prefix', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=kiaora@adam.nz')
		
		expect(response.status()).toBe(200)
		const body = await response.json()
		expect(body.subject).toBe('acct:kiaora@adam.nz')
	})

	test('should return 404 for unknown user', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=acct:unknown@adam.nz')
		
		expect(response.status()).toBe(404)
		expect(await response.text()).toBe('Not Found')
	})

	test('should return 400 for missing resource parameter', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger')
		
		expect(response.status()).toBe(400)
		expect(await response.text()).toBe('Bad Request: Missing resource parameter')
	})

	test('should return 400 for invalid resource format', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=invalid-format')
		
		expect(response.status()).toBe(400)
		expect(await response.text()).toBe('Bad Request: Invalid resource format')
	})

	test('should handle https://adam.nz URL format', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=https://adam.nz')
		
		expect(response.status()).toBe(200)
		const body = await response.json()
		expect(body.subject).toBe('acct:kiaora@adam.nz')
	})

	test('should handle https://adam.shand.net URL format', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=https://adam.shand.net')
		
		expect(response.status()).toBe(200)
		const body = await response.json()
		expect(body.subject).toBe('acct:kiaora@adam.nz')
	})

	test('should include CORS headers', async ({ request }) => {
		const response = await request.get('/.well-known/webfinger?resource=acct:kiaora@adam.nz')
		
		expect(response.headers()['access-control-allow-origin']).toBe('*')
		expect(response.headers()['access-control-allow-methods']).toBe('GET')
		expect(response.headers()['access-control-allow-headers']).toBe('Content-Type')
	})
})