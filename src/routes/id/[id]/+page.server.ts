import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId } from '$lib/utils'
import { redirect } from '@sveltejs/kit'

export const load = async ({ locals, params }) => {
	let record
	try {
		record = await locals.pb.collection(pbAdamnzId).getOne(params.id, {
			fields: `location, type`,
		})
	} catch (e) {
		pbError(e)
	}

	if (record.location) {
		redirect(308, record.location)
	} else if (record.type === 'quote') {
		redirect(308, `/quote/${params.id}`)
	} else if (record.type === 'gist') {
		redirect(308, `/gist/${params.id}`)
	}
}
