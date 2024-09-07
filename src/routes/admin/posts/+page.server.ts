import { pbError } from '$lib/pocketbase.svelte'

export const load = async ({ locals }) => {
	locals.security.isAuthenticated()

	try {
		const posts = await locals.pb.collection('adam').getFullList({
			filter: `status != "public"`,
		})
		return { posts }
	} catch (e) {
		pbError(e)
	}
}
