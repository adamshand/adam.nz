import { pbError } from '$lib/pocketbase.svelte.js'

export const actions = {
	default: async ({ locals, request }) => {
		const form = Object.fromEntries(await request.formData()) as {
			email: string
		}

		try {
			const result = await locals.pb.collection('users').requestPasswordReset(form.email)
			return { email: form.email, success: result }
		} catch (e) {
			console.error(e)
			pbError(e)
		}
	},
}
