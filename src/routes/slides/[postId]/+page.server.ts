import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte.js'

export const load = async ({ fetch, params, locals }) => {
	try {
		const post = await locals.pb.collection(pbAdamnzId).getOne(params.postId, {
			fetch: fetch,
		})
		return { post }
	} catch (e) {
		pbError(e)
	}
}
