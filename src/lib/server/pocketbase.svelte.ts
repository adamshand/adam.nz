import type { PostType } from '$lib/types'
import PocketBase from 'pocketbase'
import { env } from '$env/dynamic/private'
import { pbUrl } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte'
import { dev } from '$app/environment'

////////////// 🔥 SERVER ONLY ‼️ SERVER ONLY 💥 //////////////

export async function incrementViews(post: PostType) {
	if (!dev) {
		const views = { views: post.views + 1 }

		try {
			const pb = new PocketBase(pbUrl)
			const auth = await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASS)
			const result = await pb
				.collection('adam')
				.update(post.id, views, { fetch, $autoCancel: false })
		} catch (e) {
			console.error('incrementViews: error updating', e)
			pbError(e)
		}
	}
}

////////////// 🔥 SERVER ONLY ‼️ SERVER ONLY 💥 //////////////
