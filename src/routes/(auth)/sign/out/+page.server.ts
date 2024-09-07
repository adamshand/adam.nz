export const load = async ({ locals }) => {
	// +page.svelte runs invalidateAll() and redirects
	locals.pb.authStore.clear()
	locals.user = null
}
