import { dev } from '$app/environment'
// import { read } from '$app/server'
// import { PB_PASS, PB_USER } from '$env/static/private'
// import { pbUrl } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
import path from 'path'
// import PocketBase from 'pocketbase'
import sharp from 'sharp'

import { carnivoreEmojis, privateApiKey, publicApiKey } from '../constants'
// const pb = new PocketBase(pbUrl)

export const load = async ({ url }) => {
	const selectedEmojis = url.searchParams.get('emojis')?.split(',') || []

	function areValidEmojis() {
		const emojis = carnivoreEmojis.map((x) => x.code)
		return selectedEmojis.length === 3 && selectedEmojis.every((x) => emojis.includes(x))
	}

	if (!areValidEmojis()) {
		throw redirect(302, '/emojivore?error=invalidEmoji')
	}

	const data = await fetch('https://teemill.com/omnis/v3/product/options', {
		headers: {
			Authorization: `Bearer ${privateApiKey}`,
			'Content-Type': 'application/json',
		},
	})
	const { data: products } = await data.json()
	return { products }
}

export const actions = {
	default: async ({ fetch, locals, request }) => {
		const data = await request.formData()
		const blurb = data.get('blurb')
		const colour = data.get('colour')
		const emojis = (data.get('emojis') as string).split(',')
		const item_code = data.get('item_code')
		const title = data.get('title')

		const emojiSize = 512
		const canvasHeight = emojiSize * 2 // Adjust based on padding and desired position from the top
		const canvasWidth = 3000
		const sidePadding = emojiSize + 120
		const topPadding = emojiSize - 150

		let emojiPaths
		if (dev) {
			emojiPaths = emojis.map((x) => path.resolve(`static/emojivore/svg/${x}.svg`))
		} else {
			emojiPaths = emojis.map((x) => path.resolve(`build/client/emojivore/svg/${x}.svg`))
		}

		const emojiBuffers = await Promise.all(
			emojiPaths.map(async (p) => await sharp(p).resize(emojiSize, emojiSize).toBuffer()),
		)

		// // TODO: This looks better but requires Kit 2.0
		// const emojiReads = emojis.map((emoji) => read(`/emojivore/svg/${emoji}.svg`))
		// const emojiBuffers = await Promise.all(
		// 	emojiReads.map(async (readPromise) => {
		// 		const emojiFile = await readPromise
		// 		const buffer = await emojiFile.arrayBuffer()
		// 		return sharp(Buffer.from(buffer)).resize(emojiSize, emojiSize).toBuffer()
		// 	}),
		// )

		const composited = await sharp({
			create: {
				background: { alpha: 0, b: 0, g: 0, r: 0 },
				channels: 4,
				height: canvasHeight,
				width: canvasWidth,
			},
		})
			.composite([
				{ input: emojiBuffers[0], left: sidePadding, top: topPadding },
				{ input: emojiBuffers[1], left: canvasWidth / 2 - emojiSize / 2, top: topPadding },
				{ input: emojiBuffers[2], left: canvasWidth - sidePadding - emojiSize, top: topPadding },
			])
			.png()
			.toBuffer()

		// await fs.writeFile(path.resolve('static/composited.png'), composited)
		const encodedImage = composited.toString('base64')

		dev &&
			console.log('/emojivore/order/+page.server.ts (formData):', {
				colour,
				emojiBuffers,
				emojis,
				item_code,
			})

		try {
			const options = {
				body: JSON.stringify({
					colours: colour,
					cross_sell: false,
					description: blurb,
					// image_url: 'https://www.pngmart.com/files/11/Doge-Meme-PNG-Photos.png',
					image_url: `data:image/png;base64,${encodedImage}`,
					item_code,
					name: `Emojivore: ${title}`,
				}),
				headers: {
					Accept: 'application/json, text/html',
					Authorization: `Bearer ${publicApiKey}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			}

			dev && console.log('/emojivore/order/+page.server.ts (fetch):', JSON.parse(options.body))
			// return

			const response = await fetch('https://teemill.com/omnis/v3/product/create', options)
			if (!response.ok) {
				const errorText = await response.text()
				console.error(
					`API request failed with status ${response.status}: ${response.statusText}`,
					`Response body: ${errorText}`,
				)
				throw error(500, `API Error: ${response.statusText}`)
			}

			const json = await response.json()

			if (dev) {
				console.log(json)
			} else {
				try {
					// await pb.collection('users').authWithPassword(PB_USER, PB_PASS)
					await locals.pb.collection('teemill_orders').create({ order: json })
					// console.log(r.location, r.views, 'views')
				} catch (e) {
					console.error('/emojivore/order/+page.server: error adding order log', e)
				}
			}
			return { url: json.url }
			// throw redirect(302, json.url)  // this should work but doesn't, not sure why.  moving on.
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error('error:', err)
			const message = err?.message ?? 'Unexpected error occurred'
			throw error(500, `Server Error: ${message}`)
		}
	},
}
