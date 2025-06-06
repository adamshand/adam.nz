import type { RequestHandler } from '@sveltejs/kit'

export const GET: RequestHandler = async ({ url }) => {
	const actor = {
		'@context': [
			'https://www.w3.org/ns/activitystreams',
			'https://w3id.org/security/v1'
		],
		id: 'https://adam.nz/api/activitypub/actor',
		type: 'Person',
		name: 'Adam Shand',
		preferredUsername: 'adam',
		summary: `I'm a nerd, facilitator, and gardener based on New Zealand's Kāpiti Coast.`,
		url: 'https://adam.nz',
		icon: {
			type: 'Image',
			mediaType: 'image/jpeg',
			url: 'https://adam.nz/avatar.jpg'
		},
		image: {
			type: 'Image',
			mediaType: 'image/jpeg',
			url: 'https://adam.nz/avatar.jpg'
		},
		inbox: 'https://adam.nz/api/activitypub/inbox',
		outbox: 'https://adam.nz/api/activitypub/outbox',
		followers: 'https://adam.nz/api/activitypub/followers',
		following: 'https://adam.nz/api/activitypub/following',
		publicKey: {
			id: 'https://adam.nz/api/activitypub/actor#main-key',
			owner: 'https://adam.nz/api/activitypub/actor',
			publicKeyPem: `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEApf/6Jim7j/Ciw7Gf+Z0f
PbIstgMyDnBVw6S+4qM0VmpVLODBY/Z/UqYyh2JiPwOv83UgrG4kwUYFdawYfTAL
bHfEQH4iuTYqbbvwcwny44eJvHLelRBIJ9XI4hm5mvjLcHnj/wUGskd/wJ5SzNun
e886/s/LcZ2w+zTdD8QEcaE9Cx9q2BPPv3L+RxqMcKjim5Z2QuBkLNd2Ct1kau7b
lb/k2uoCmgKyy1v9d0pj7Tpi11ouvdEL4k+b4TATYL07ZKXz1R90N7rEZvj7NPF/
2lO2reShfor0qv5B10E/FIKG9v6e25c58Y2HtRr+POqASDFWQxehVMplzMf5zHsh
dkkmnMakFuKCXgh1RqqDVN7mubb0Oig7n+FG+AevevJY/kpFG2CKpH1nLtWh7I23
d7aRJ08tMC7X2A4R7bh5yvwPhvZKcmK+jW8TF1OicxIQ0/FSPiY4Sr9t29ri1km/
wZ0lIVQfZwbk9U4OrARIn6JyfJwyaTnUTV+KTFfI8yeD1/QNrspugMsfUyK37vSC
egvmwYskShLkrGbkYyBWszJGXBiahSfKNl+pk6Zix/sBmdTHJayhQBRwJv+1HxfT
Azw18DNN96nc+YlgGaUzaD1bUz9yOcilh2WrnPvN+a4HnCbdvRBN+zjSYu/GlGSU
5O67cuJjevLb3jwQncfqdzkCAwEAAQ==
-----END PUBLIC KEY-----
`
		}
	}

	return new Response(JSON.stringify(actor, null, 2), {
		status: 200,
		headers: {
			'Content-Type': 'application/activity+json',
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	})
}