// 
import { pbAdamnzId } from '$lib/utils.js'
import { pbError } from '$lib/pocketbase.svelte.js'
import { getRandomElement } from '$lib'

export const load = async ({ fetch, locals, url }) => {
	// const contactLols = 'kiochbanomkj7zi'
	// return await getRandomPbImageUrl(contactLols, '512x0')
	try {
		let post = await locals.pb.collection(pbAdamnzId).getFirstListItem('location="/contact"', {
			fetch,
			filter: `location = "${url.pathname}"`,
		})
		post.photos = [getRandomElement(post.photos)]
		return { post }
	} catch (e) {
		pbError(e)
	}
}