import { pbAdamnzId } from '$lib/utils'

export const load = async ({ locals }) => {
	const gists = await locals.pb.collection(pbAdamnzId).getList(1, 101, {
		fields: `content, id, title`,
		filter: `type = "gist" && status = "public"`,
		sort: '-updated',
	})
	return { gists: gists.items }
}
