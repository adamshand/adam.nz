import { dev } from '$app/environment'

export const load = async ({ locals }) => {
	dev && locals.security.isAuthenticated()
}
