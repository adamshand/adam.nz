import { dev } from '$app/environment'
import { TEEMILL_KEY } from '$env/static/private'
import { PUBLIC_TEEMILL_KEY } from '$env/static/public'
// import { read } from '$app/server'
// import { PB_PASS, PB_USER } from '$env/static/private'
// import { pbUrl } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
import path from 'path'
// import PocketBase from 'pocketbase'
import sharp from 'sharp'

import { foodEmojiCodes } from '../foodEmojis'

import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ url, fetch }) => {
	const selectedEmojis = url.searchParams.get('emojis')?.split(',') || []

	function areValidEmojis() {
		return selectedEmojis.length === 3 && selectedEmojis.every((emoji) => foodEmojiCodes.has(emoji))
	}

	if (!areValidEmojis()) {
		throw redirect(302, '/emojivore?error=invalidEmoji')
	}

	const data = await fetch('https://teemill.com/omnis/v3/product/options', {
		headers: {
			Authorization: `Bearer ${TEEMILL_KEY}`,
			'Content-Type': 'application/json',
		},
	})
	const { data: products } = await data.json()
	console.log(products)
	return { products }
}

export const actions: Actions = {
	default: async ({ fetch, locals, request }) => {
		const data = await request.formData()
		const blurb = String(data.get('blurb') ?? '')
		const colour = String(data.get('colour') ?? '')
		const emojisRaw = data.get('emojis')
		const item_code = String(data.get('item_code') ?? '')
		const logoYRaw = data.get('logoY')
		const title = String(data.get('title') ?? '')

		if (typeof emojisRaw !== 'string') {
			throw error(400, 'Invalid emoji selection')
		}

		const emojis = emojisRaw.split(',').filter(Boolean)
		const emojisAreValid = emojis.length === 3 && emojis.every((emoji) => foodEmojiCodes.has(emoji))

		if (!colour || !item_code || !title || !emojisAreValid) {
			throw error(400, 'Invalid order data')
		}

		const emojiSize = 512
		const canvasHeight = emojiSize * 2 // Adjust based on padding and desired position from the top
		const canvasWidth = 3000
		const sidePadding = emojiSize + 120
		// `logoY` is the emoji row's top edge as a fraction of the design canvas height.
		// Keep this in sync with the preview math in `src/routes/emojivore/Mockup.svelte`.
		const logoY = (() => {
			const n = typeof logoYRaw === 'string' ? Number.parseFloat(logoYRaw) : Number.NaN
			return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 0.35
		})()
		const topPadding = Math.round(
			Math.min(canvasHeight - emojiSize, Math.max(0, logoY * canvasHeight)),
		)

		let emojiPaths
		if (dev) {
			emojiPaths = emojis.map((x) => path.resolve(`static/emojivore/svg/${x.toUpperCase()}.svg`))
		} else {
			emojiPaths = emojis.map((x) =>
				path.resolve(`build/client/emojivore/svg/${x.toUpperCase()}.svg`),
			)
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
					Authorization: `Bearer ${PUBLIC_TEEMILL_KEY}`,
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
