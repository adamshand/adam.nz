import { expect, test } from '@playwright/test'

test.describe('ActivityPub endpoints', () => {
	test('actor endpoint should return valid ActivityPub actor', async ({ request }) => {
		const response = await request.get('/api/activitypub/actor')
		
		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('application/activity+json')
		
		const actor = await response.json()
		expect(actor['@context']).toContain('https://www.w3.org/ns/activitystreams')
		expect(actor.id).toBe('https://adam.nz/api/activitypub/actor')
		expect(actor.type).toBe('Person')
		expect(actor.name).toBe('Adam Shand')
		expect(actor.preferredUsername).toBe('adam')
		expect(actor.url).toBe('https://adam.nz')
		expect(actor.inbox).toBe('https://adam.nz/api/activitypub/inbox')
		expect(actor.outbox).toBe('https://adam.nz/api/activitypub/outbox')
		expect(actor.icon.url).toBe('https://adam.nz/avatar.jpg')
		expect(actor.publicKey.id).toBe('https://adam.nz/api/activitypub/actor#main-key')
	})

	test('inbox should reject GET requests', async ({ request }) => {
		const response = await request.get('/api/activitypub/inbox')
		expect(response.status()).toBe(405)
	})

	test('inbox should accept valid ActivityPub activities', async ({ request }) => {
		const followActivity = {
			'@context': 'https://www.w3.org/ns/activitystreams',
			type: 'Follow',
			actor: 'https://example.com/users/alice',
			object: 'https://adam.nz/api/activitypub/actor'
		}

		const response = await request.post('/api/activitypub/inbox', {
			data: followActivity,
			headers: {
				'Content-Type': 'application/activity+json'
			}
		})
		
		expect(response.status()).toBe(202)
	})

	test('inbox should handle malformed JSON', async ({ request }) => {
		const response = await request.post('/api/activitypub/inbox', {
			data: 'invalid json',
			headers: {
				'Content-Type': 'application/activity+json'
			}
		})
		
		expect(response.status()).toBe(400)
	})

	test('outbox should return collection', async ({ request }) => {
		const response = await request.get('/api/activitypub/outbox')
		
		expect(response.status()).toBe(200)
		expect(response.headers()['content-type']).toBe('application/activity+json')
		
		const outbox = await response.json()
		expect(outbox['@context']).toBe('https://www.w3.org/ns/activitystreams')
		expect(outbox.type).toBe('OrderedCollection')
		expect(outbox.id).toBe('https://adam.nz/api/activitypub/outbox')
		expect(outbox.totalItems).toBe(0)
		expect(outbox.first).toBe('https://adam.nz/api/activitypub/outbox?page=1')
	})

	test('outbox should return paginated collection', async ({ request }) => {
		const response = await request.get('/api/activitypub/outbox?page=1')
		
		expect(response.status()).toBe(200)
		const page = await response.json()
		expect(page.type).toBe('OrderedCollectionPage')
		expect(page.partOf).toBe('https://adam.nz/api/activitypub/outbox')
		expect(Array.isArray(page.orderedItems)).toBe(true)
	})

	test('outbox should accept POST activities', async ({ request }) => {
		const createActivity = {
			'@context': 'https://www.w3.org/ns/activitystreams',
			type: 'Create',
			actor: 'https://adam.nz/api/activitypub/actor',
			object: {
				type: 'Note',
				content: 'Hello, fediverse!'
			}
		}

		const response = await request.post('/api/activitypub/outbox', {
			data: createActivity,
			headers: {
				'Content-Type': 'application/activity+json'
			}
		})
		
		expect(response.status()).toBe(201)
	})
})