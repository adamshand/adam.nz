import { pbAdamnzId } from '$lib/utils'

export const load = async ({ locals, params }) => {
	const quotes = await locals.pb.collection(pbAdamnzId).getFullList({
		filter: `type = 'quote' && tags ~ "${params.tag}"`,
		sort: '-created',
	})
	return { quotes }
}
