import type { RequestHandler } from './$types'
import { json } from '@sveltejs/kit'
import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte'

export const GET: RequestHandler = async ({ locals }) => {
	try {
		const latestPost = await locals.pb.collection(pbAdamnzId).getFirstListItem('', {
			fields: 'updated',
			filter: `format = 'post' && category !~ 'meta' && status = 'public' && location != ''`,
			sort: '-updated',
		})

		const latestUpdate = latestPost.updated

		return json({ latestUpdate })
	} catch (e) {
		pbError(e)
		console.error('/api/posts/latest: error getting latest post', e)
		return json({ error: 'Failed to fetch latest post' }, { status: 500 })
	}
}