import { pbError } from '$lib/pocketbase.svelte.js'
import { pbAdamnzId } from '$lib/utils'
import { redirect } from '@sveltejs/kit'
import { error } from '@sveltejs/kit'

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
	} else {
		// type = books
		error(404, "You found something that exists but can't be shown.  Mysterious ...")
	}
}

// function eww<T>(promise: Promise<T>): Promise<{ data: T | null; error: any }> {
// 	return Promise.allSettled([promise]).then(([result]) => {
// 		if (result.status === 'fulfilled') {
// 			return { data: result.value, error: null }
// 		} else {
// 			return { data: null, error: result.reason }
// 		}
// 	})
// }

// const { data: record, error: err } = await eww<PageType>(locals.pb.collection(pbAdamnzId)
// 	.getOne(params.id, {
// 		fields: `location, type`,
// 	}));
