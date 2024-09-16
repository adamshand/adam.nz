import type { PageServerLoad } from './$types'

import { dev } from '$app/environment'

export const load: PageServerLoad = async ({ locals }) => {
	dev && locals.security.isAuthenticated()
	// throw new Error('SSR Test Error (+page.server)')
	console.log(ssrVariableNoExist)
}
