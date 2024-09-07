import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId, pbUrl } from '$lib/utils'

export const load = async ({ fetch, params, locals }) => {
	try {
		const post = await locals.pb.collection(pbAdamnzId).getOne(params.postId, {
			fetch,
		})
		const urlPrefix = `${pbUrl}/api/files/${post.collectionId}/${post.id}/`
		const { content, ...postWithoutContent } = post

		return {
			post: postWithoutContent,
			// slides: {
			index: params.index,
			urlPrefix,
			// },
		}
	} catch (e) {
		pbError(e)
	}
}
