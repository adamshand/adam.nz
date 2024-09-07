import { error } from '@sveltejs/kit'
import { pbError } from '$lib/pocketbase.svelte'

export const load = async ({ fetch, params, locals }) => {
	let post

	try {
		post = await locals.pb.collection('adam').getOne(params.quoteId, {
			fetch,
		})
	} catch (e) {
		pbError(e)
	}

	if (post.type !== 'quote') {
		error(404, `Requested id is not a quote.`)
	}

	return { post }
}
