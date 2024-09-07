// import { PB_PASS, PB_USER } from '$env/static/private'
// import { pbUrl } from '$lib/utils'
// import PocketBase from 'pocketbase'

// const pb = new PocketBase(pbUrl)
// await pb.collection('users').authWithPassword(PB_USER, PB_PASS)

export const load = async ({ locals }) => {
	const emojivore = await locals.pb.collection('products').getFullList({
		filter: `project = "emojivore"`,
	})
	return { emojivore }
}
