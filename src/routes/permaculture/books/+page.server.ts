import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId } from '$lib/utils'

export const load = async ({ locals }) => {
	try {
		const records = await locals.pb.collection(pbAdamnzId).getList(1, 101, {
			filter: `format = "book" && category ~ 'nz' && category ~ 'permaculture' && status = "public"`,
			sort: '-actualCreated',
		})
		return { books: records.items }
	} catch (e) {
		pbError(e)
	}
}
