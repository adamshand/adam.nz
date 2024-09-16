import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ locals }) => {
	locals.security.isAuthenticated()
	throw new Error('SSR Test Error (+page.server)')
	// console.log(ssrVariableNoExist)
}
