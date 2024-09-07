import { redirect } from '@sveltejs/kit'

export const load = async ({ fetch, locals }) => {
	const gist = await locals.pb.collection('adam').getList(1, 1, {
		filter: 'type = "gist"',
		field: 'id',
		sort: '@random',
		fetch,
	})
	redirect(303, `/gist/${gist.items[0].id}`)
}
