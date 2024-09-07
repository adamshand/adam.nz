import { pbCommentsId } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'

export const load = async ({ locals }) => {
	locals.security.isAuthenticated()
}

export const actions = {
	approve: async ({ locals, request }) => {
		const data = await request.formData()
		const id = data.get('id') as string
		const location = data.get('location') as string

		const commentData = {
			isApproved: true,
		}

		if (id && location) {
			await locals.pb.collection(pbCommentsId).update(id, commentData)
			//FIXME: do i need to check status of action before redirecting?
			// console.log('approveComment', { record, location })
			// FIXME: need to notify of success/failure somehow, toast?
			redirect(303, location + '#comments')
		} else {
			error(400, 'Approve comment form action: Missing or invalid form data')
		}
	},

	delete: async ({ locals, request }) => {
		const data = await request.formData()
		const id = data.get('id') as string
		const location = data.get('location') as string

		if (id && location) {
			await locals.pb.collection(pbCommentsId).delete(id)
			// console.log('deleteComment', { record })
			// FIXME: need to notify of success/failure somehow, toast?
			redirect(303, location + '#comments')
		} else {
			error(400, 'Delete comment form action: missing or invalid form data')
		}
	},
}
