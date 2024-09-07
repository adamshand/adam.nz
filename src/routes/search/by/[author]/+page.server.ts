import { pbAdamnzId } from '$lib/utils'

export const load = async ({ locals, params }) => {
	const data = await locals.pb.collection(pbAdamnzId).getList(1, 27, {
		filter: `(format = 'quote' || format = 'book') && author = "${params.author}"`,
		sort: '-created',
	})
	return { byAuthor: data.items }
}
