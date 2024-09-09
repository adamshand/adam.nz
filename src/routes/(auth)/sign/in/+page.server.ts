import { pbError } from '$lib/pocketbase.svelte.js'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	locals.user && redirect(307, '/admin')
}

export const actions = {
	default: async ({ locals, request }) => {
		const form = Object.fromEntries(await request.formData()) as {
			password: string
			username: string
		}

		let results
		try {
			results = await locals.pb.collection('users').authWithPassword(form.username, form.password)
		} catch (e) {
			pbError(e)
		}
		// if (results) redirect(307, '/admin')
	},
}
