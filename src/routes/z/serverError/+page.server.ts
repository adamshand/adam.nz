export const load = async ({ locals }) => {
	locals.security.isAuthenticated()
	// throw new Error('SSR Test Error (+page.server)')
	console.log(variableNoExist)
}
