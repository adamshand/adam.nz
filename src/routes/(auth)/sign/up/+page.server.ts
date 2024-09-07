import { dev } from '$app/environment'
import { pbError } from '$lib/pocketbase.svelte'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	if (locals.user?.verified === true) {
		redirect(307, '/')
	} else if (locals.user?.verified === false) {
		redirect(307, '/verify')
	}
}

export const actions = {
	default: async ({ locals, request }) => {
		const form = Object.fromEntries(await request.formData()) as {
			email: string
			name: string
			password: string
			passwordConfirm: string
		}

		dev && console.log('(auth)/sign/up/+page.server', form)

		const user = {
			email: form.email,
			name: form.name,
			password: form.password,
			passwordConfirm: form.passwordConfirm,
			username: form.name.toLowerCase().replace(/[^A-Za-z0-9]/g, ''),
		}

		dev && console.log('user', user)

		try {
			if (user.email && user.password) {
				await locals.pb.collection('users').create(user)
				await locals.pb.collection('users').requestVerification(user.email)
				await locals.pb.collection('users').authWithPassword(user.email, user.password)
			}
		} catch (err: unknown) {
			pbError(err)
		}
		redirect(307, '/verify')
	},
}
