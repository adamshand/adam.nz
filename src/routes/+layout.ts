import type { LayoutLoad } from './$types'

import { browser, dev } from '$app/environment'
import { pbError } from '$lib/pocketbase.svelte.js'

export const load: LayoutLoad = async ({ data, fetch }) => {
	if (browser && !dev) {
		const browserCache = sessionStorage.getItem('postsAndTypes')

		if (browserCache) {
			const { posts, types } = JSON.parse(browserCache)
			console.log(`/+layout: sessionStorage posts (${posts.length}) and types (${types.length})`)
			return { ...data, posts, types }
		}
	}

	// console.log(`/+layout: (dev: ${dev}) sessionStorage disabled`)

	try {
		const { posts, types } = await fetch('/api/posts').then((r) => r.json())

		if (browser && !dev) {
			sessionStorage.setItem('postsAndTypes', JSON.stringify({ posts, types }))
		}

		return { ...data, posts, types }
	} catch (e) {
		console.error('/+layout: error getting posts', e)
		pbError(e)
	}
}
