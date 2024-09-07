import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId } from '$lib/utils'
import { incrementViews } from '$lib/server/pocketbase.svelte'

export const load = async ({ locals, params }) => {
	try {
		const book = await locals.pb.collection(pbAdamnzId).getOne(params.bookId)
		incrementViews(book)
		return { book }
	} catch (e) {
		pbError(e)
	}
}
