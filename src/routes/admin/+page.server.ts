import { redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	locals.security.isAuthenticated()
}
