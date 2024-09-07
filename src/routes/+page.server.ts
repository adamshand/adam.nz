import { getRandomPbImageUrl } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte'

export const load = async ({ fetch, locals }) => {
	try {
		const quote = await locals.pb.collection('quotes_public').getList(1, 1, {
			fetch,
			sort: '@random',
		})

		// const adam = await getRandomPbImageUrl('i9abatyw4ug5ag9', '512x0')
		const adam = await getRandomPbImageUrl('i9abatyw4ug5ag9')
		const cute = await getRandomPbImageUrl('e434x17ypq7zxqt')
		const lols = await getRandomPbImageUrl('nh3m0yv721ist8w')

		return {
			images: {
				adam: { url: adam.imageUrl },
				cute: { url: cute.imageUrl },
				lols: { url: lols.imageUrl },
			},
			quote: quote.items[0],
		}
	} catch (e) {
		console.error('/+page.ts: error getting hero quote or images', e)
		pbError(e)
	}
}
