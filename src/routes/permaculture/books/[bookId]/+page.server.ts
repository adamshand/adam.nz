import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId } from '$lib/utils'

export const load = async ({ locals, params }) => {
	try {
		const book = await locals.pb.collection(pbAdamnzId).getOne(params.bookId)
		return { book }
	} catch (e) {
		pbError(e)
	}
}
