export const load = async ({ locals }) => {
	// console.log('+layout.server: locals', locals.user)
	return {
		user: locals.user ?? null,
	}
}

// export const csr = false
