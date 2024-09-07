import { pbError } from '$lib/pocketbase.svelte'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	locals.security.isAuthenticated()
}

export const actions = {
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
