import { yearRegex } from '$lib/utils'
import { error } from '@sveltejs/kit'

export const load = async ({ params, parent }) => {
	const { types } = await parent()

	if (!types.includes(params.slug) && !yearRegex.test(params.slug)) {
		error(404, `Category "${params.slug}" not found.`)
	}
}
