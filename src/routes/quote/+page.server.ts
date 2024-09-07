import { redirect } from '@sveltejs/kit'

export const load = async ({ fetch, locals }) => {
	const quote = await locals.pb.collection('adam').getList(1, 1, {
		fetch,
		field: 'id',
		filter: 'type = "quote"',
		sort: '@random',
	})
	redirect(307, `/quote/${quote.items[0].id}`)
}
