import type { PostType } from '$lib/types'

import { pbAdamnzId } from '$lib/utils'

export const actions = {
	search: async ({ locals, request }) => {
		const formData = await request.formData()
		const query = formData.get('q') ?? ''

		// FIXME: add try/catch
		const results: PostType[] = await locals.pb.collection(pbAdamnzId).getFullList({
			filter: `title ~ "${query}" || content ~ "${query}"`,
		})
		return { results: structuredClone(results), success: true }
	},
}
