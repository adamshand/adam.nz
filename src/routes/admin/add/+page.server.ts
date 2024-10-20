import type { Actions, PageServerLoad } from './$types'

import { pbError } from '$lib/pocketbase.svelte'
import { redirect } from '@sveltejs/kit'

export const load: PageServerLoad = async ({ locals }) => {
	locals.security.isAuthenticated()

	try {
		const tags = await locals.pb
			.collection('adam_tags')
			.getFullList()
			.then((r: { tag: string }[]) => r.map((x) => x.tag))

		const authors = await locals.pb
			.collection('adam_authors')
			.getFullList()
			.then((r: { author: string }[]) => r.map((x) => x.author))

		return { tags, authors }
	} catch (e) {
		pbError(e)
	}
}

export const actions: Actions = {
	default: async ({ locals, request }) => {
		const form = await request.formData()
		const quote = form.get('quote') as string

		let record
		try {
			record = await locals.pb.collection('adam').create(JSON.parse(quote))
		} catch (e) {
			pbError(e)
		}

		if (record?.id) {
			redirect(307, `/id/${record.id}`)
		}
	},
}
