import { dev } from '$app/environment'

export const load = async ({ locals }) => {
	dev && locals.security.isAuthenticated()
	// throw new Error('SSR Test Error (+page.server)')
	console.log(ssrVariableNoExist)
}
