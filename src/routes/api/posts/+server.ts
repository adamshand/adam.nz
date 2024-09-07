import type { RequestHandler } from './$types'
import type { PostType } from '$lib/types'
import { json } from '@sveltejs/kit'
import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte'

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const posts = await locals.pb.collection(pbAdamnzId).getFullList({
			fields: `author, collectionId, created, id, location, photos, status, title, tags, type, views`,
			// filter: `type != 'gist' && type != 'meta' && type != 'quote' && type != 'book' && status != 'draft'`,
			filter: `location != '' && format = 'post' && status != 'draft' && category !~ 'meta'`,
			sort: '-created',
		})

		const types = [...new Set(posts.map((post: PostType) => post.type).sort())]
		// console.log(`/api/posts: posts (${posts.length}) and types (${types.length})`)

		return json({ posts, types })
	} catch (e) {
		pbError(e)
		console.error('/api/posts: error getting posts', e)
		return json({ error: 'Failed to fetch posts' }, { status: 500 })
	}
}
