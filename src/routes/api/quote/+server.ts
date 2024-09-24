import { decodeHtmlEntities, pbAdamnzId } from '$lib/utils'

export const GET = async ({ locals, url: requestUrl }) => {
	const id = requestUrl.searchParams.get('id')

	let record
	try {
		if (!id || id === 'random') {
			record = await locals.pb.collection(pbAdamnzId).getList(1, 1, {
				filter: 'type = "quote"',
				sort: '@random',
			})
		} else {
			record = await locals.pb.collection(pbAdamnzId).getList(1, 1, {
				filter: `type = "quote" && id = "${id}"`,
			})
		}
		const quote = decodeHtmlEntities(record.items[0].content.replace(/<[^>]*>?/gm, ''))
		const author = record.items[0].author

		const result = `${quote} \n\n— ${author}`
		return new Response(result)
	} catch (e) {
		console.error('/api/quote/+server.ts: error getting quote: ', e)
	}
}
