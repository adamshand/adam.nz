import type { RequestHandler } from './$types'
import type { PostType } from '$lib/types'
import { json } from '@sveltejs/kit'
import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte'

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const posts: PostType[] = await locals.pb.collection(pbAdamnzId).getFullList({
			fields: `author, collectionId, created, actualCreated, id, location, photos, status, title, tags, type, views`,
			filter: `format = 'post' && category !~ 'meta' && status = 'public' && location != ''`,
			sort: '-created',
		})

		// If actualCreated set, overwrite created, and then sort posts again by created.
		posts.forEach(post => {
			if (post.actualCreated) post.created = post.actualCreated
		})
		posts.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())


		const types = [...new Set(posts.map((post: PostType) => post.type).sort())]
		// console.log(`/api/posts: posts (${posts.length}) and types (${types.length})`)

		return json({ posts, types })
	} catch (e) {
		pbError(e)
		console.error('/api/posts: error getting posts', e)
		return json({ error: 'Failed to fetch posts' }, { status: 500 })
	}
}
