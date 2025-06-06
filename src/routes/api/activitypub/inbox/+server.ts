import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async () => {
	return new Response('Method Not Allowed', { status: 405 })
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const activity = await request.json()
		
		console.log('Received ActivityPub activity:', activity)
		
		switch (activity.type) {
			case 'Follow':
				console.log(`Follow request from ${activity.actor}`)
				break
			case 'Like':
				console.log(`Like from ${activity.actor} on ${activity.object}`)
				break
			case 'Create':
				console.log(`Create activity from ${activity.actor}`)
				break
			case 'Announce':
				console.log(`Announce/boost from ${activity.actor}`)
				break
			default:
				console.log(`Unknown activity type: ${activity.type}`)
		}
		
		return new Response('', {
			status: 202,
			headers: {
				'Content-Type': 'application/activity+json',
			},
		})
	} catch (error) {
		console.error('Error processing ActivityPub activity:', error)
		return new Response('Bad Request', { 
			status: 400,
			headers: {
				'Content-Type': 'application/activity+json',
			},
		})
	}
}