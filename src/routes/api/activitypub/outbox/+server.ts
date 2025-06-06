import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const page = url.searchParams.get('page')
	
	if (page) {
		const outboxPage = {
			'@context': 'https://www.w3.org/ns/activitystreams',
			id: `https://adam.nz/api/activitypub/outbox?page=${page}`,
			type: 'OrderedCollectionPage',
			partOf: 'https://adam.nz/api/activitypub/outbox',
			orderedItems: []
		}
		
		return new Response(JSON.stringify(outboxPage, null, 2), {
			status: 200,
			headers: {
				'Content-Type': 'application/activity+json',
				'Access-Control-Allow-Origin': '*',
			},
		})
	}
	
	const outbox = {
		'@context': 'https://www.w3.org/ns/activitystreams',
		id: 'https://adam.nz/api/activitypub/outbox',
		type: 'OrderedCollection',
		totalItems: 0,
		first: 'https://adam.nz/api/activitypub/outbox?page=1',
		last: 'https://adam.nz/api/activitypub/outbox?page=1'
	}

	return new Response(JSON.stringify(outbox, null, 2), {
		status: 200,
		headers: {
			'Content-Type': 'application/activity+json',
			'Access-Control-Allow-Origin': '*',
		},
	})
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const activity = await request.json()
		
		console.log('Outgoing ActivityPub activity:', activity)
		
		return new Response('', {
			status: 201,
			headers: {
				'Content-Type': 'application/activity+json',
			},
		})
	} catch (error) {
		console.error('Error processing outgoing ActivityPub activity:', error)
		return new Response('Bad Request', { 
			status: 400,
			headers: {
				'Content-Type': 'application/activity+json',
			},
		})
	}
}