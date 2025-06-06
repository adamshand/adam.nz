import type { RequestHandler } from '@sveltejs/kit'
// import type { RequestHandler } from './$types'

// export const GET: RequestHandler = async () => {
// 	return new Response()
// }

export const GET: RequestHandler = async ({ url }) => {
	const resource = url.searchParams.get('resource')

	if (!resource) {
		return new Response('Bad Request: Missing resource parameter', { status: 400 })
	}

	const decoded = decodeURIComponent(resource)
	
	let account = ''
	if (decoded.startsWith('acct:')) {
		account = decoded.split(':')[1].trim()
	} else if (decoded.startsWith('https://')) {
		if (decoded === 'https://adam.nz' || decoded === 'https://adam.shand.net') {
			account = 'kiaora@adam.nz'
		}
	} else if (decoded.includes('@')) {
		account = decoded
	} else {
		return new Response('Bad Request: Invalid resource format', { status: 400 })
	}

	if (account === 'kiaora@adam.nz' || account === 'adam@shand.net') {
		const webfingerResponse = {
			subject: `acct:kiaora@adam.nz`,
			aliases: [`https://adam.nz`, `https://adam.shand.net`],
			links: [
				{
					rel: 'http://webfinger.net/rel/profile-page',
					type: 'text/html',
					href: 'https://adam.nz',
				},
				{
					rel: 'http://webfinger.net/rel/avatar',
					type: 'image/jpeg',
					href: 'https://adam.nz/avatar.jpg',
				},
				{
					rel: 'self',
					type: 'application/activity+json',
					href: 'https://adam.nz/api/activitypub/actor',
				},
			],
		}

		return new Response(JSON.stringify(webfingerResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/jrd+json',
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'GET',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		})
	} else {
		return new Response('Not Found', { status: 404 })
	}
}
