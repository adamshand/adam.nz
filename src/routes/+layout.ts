import type { LayoutLoad } from './$types'

import { browser, dev } from '$app/environment'
import { pbError } from '$lib/pocketbase.svelte.js'

export const load: LayoutLoad = async ({ data, fetch }) => {

	// CACHE INVALIDATION DOESN"T WORK PROPERLY IF LATEST POST HAS actualCreated set.  <grr />
	// BUT worst case it just loads the data everytime from PB, so still better.

	// Fix is to change actualCreated to published and then add page for adding content that copies created to published if not specified.

	if (browser && !dev) {
		const browserCache = sessionStorage.getItem('postsAndTypes')

		if (browserCache) {
			try {
				const cachedData = JSON.parse(browserCache)
				const { posts: cachedPosts, types: cachedTypes, latestUpdate: cachedlatestUpdate } = cachedData

				if (cachedPosts && cachedTypes && cachedlatestUpdate) {
					const { latestUpdate } = await fetch('/api/posts/latest').then((r) => r.json())

					if (cachedlatestUpdate === latestUpdate) {
						dev && console.log(`/+layout: using sessionStorage cache - posts (${cachedPosts.length}) and types (${cachedTypes.length})`)
						return { ...data, posts: cachedPosts, types: cachedTypes }
					} else {
						dev && console.log(`/+layout: cache stale (cached: ${cachedlatestUpdate}, fresh: ${latestUpdate}) - fetching fresh data`)
					}
				}
			} catch (e) {
				console.log('/+layout: cache parse error, fetching fresh data')
			}
		}
	}

	console.log(`/+layout: fetching fresh data (dev: ${dev})`)

	try {
		const { posts, types } = await fetch('/api/posts').then((r) => r.json())

		const latestUpdate = posts[0]?.updated || null
		dev && console.log(`/+layout: latestUpdate (no cache): ${latestUpdate}`)

		if (browser && !dev) {
			sessionStorage.setItem('postsAndTypes', JSON.stringify({ posts, types, latestUpdate }))
		}

		return { ...data, posts, types }
	} catch (e) {
		console.error('/+layout: error getting posts', e)
		pbError(e)
	}
}
