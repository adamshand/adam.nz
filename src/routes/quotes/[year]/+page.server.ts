import { pbAdamnzId } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export const load = async ({ fetch, locals, params }) => {
	const year = Number(params.year)
	let quotes

	// Anthing older than 2001 redirects to 2001. 2001 shows all posts up to the end of 2001. Everything else shows that years quotes.
	if (year >= 2002) {
		quotes = await locals.pb.collection(pbAdamnzId).getFullList({
			fetch,
			filter: `format = "quote" && created >= "${year}-01-01" && created <= "${year}-12-31" && status = "public"`,
			// sort: '@random',
			sort: '-created'
		})
	} else if (year == 2001) {
		quotes = await locals.pb.collection(pbAdamnzId).getFullList({
			fetch,
			filter: `format = "quote" && created <= "2001-12-31" && status = "public"`,
			// sort: '@random',
			sort: '-created'
		})
	} else {
		redirect(307, '/quotes/2001')
	}

	return { quotes, year }
}
