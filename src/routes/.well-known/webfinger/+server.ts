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
	const account = decoded.includes(':') ? decoded.split(':')[1].trim() : decoded

	// In a real application, you would look up the user in your database
	// and construct the response based on their data
	if (account === 'kiaora@adam.nz' || account === 'adam@shand.net') {
		const webfingerResponse = {
			subject: `acct:kiaora@adam.nz`,
			aliases: [`https://adam.nz`, `https://adam.shand.net`],
			links: [
				// {
				// 	rel: 'http://webfinger.net/rel/profile-page',
				// 	type: 'text/html',
				// 	href: 'https://yourdomain.com/@user',
				// },
				{
					rel: 'http://webfinger.net/rel/avatar',
					type: 'image/jpeg',
					href: 'https://adam.nz/avatar.jpg',
				},
			],
		}

		return new Response(JSON.stringify(webfingerResponse), {
			status: 200,
			headers: {
				'Content-Type': 'application/jrd+json',
			},
		})
	} else {
		return new Response('Not Found', { status: 404 })
	}
}
