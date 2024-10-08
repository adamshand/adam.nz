import { redirect } from '@sveltejs/kit'
import { pbError } from '$lib/pocketbase.svelte'
import { incrementViews } from '$lib/server/pocketbase.svelte'

export const load = async ({ fetch, params, locals }) => {
	let post

	try {
		post = await locals.pb.collection('adam').getOne(params.quoteId, {
			fetch,
		})
		incrementViews(post)
	} catch (e) {
		pbError(e)
	}

	if (post.type !== 'quote') {
		redirect(307, `/id/${post.id}`)
	}

	return { post }
}
