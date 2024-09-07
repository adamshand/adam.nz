// this is not secure, every route should be protected by a +page.server.ts because layouts
// don't rerun on client navigation but it's here as a stop gap incase I forget.

export const load = async ({ locals }) => {
	locals.security.isAuthenticated()
}
