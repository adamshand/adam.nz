import { pbAdamnzId, pbUrl } from '$lib/utils'

export const load = async ({ fetch, locals }) => {
	const albums = await locals.pb.collection(pbAdamnzId).getFullList({
		fetch: fetch,
		filter: 'photos:length > 1',
		sort: '-created',
	})
	return { albums }
}
