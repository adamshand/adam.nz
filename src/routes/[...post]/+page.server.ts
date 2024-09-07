// import { PB_PASS, PB_USER } from '$env/static/private'
import { pbCommentsId } from '$lib/utils'

export const actions = {
	previewComment: async ({ request, url }) => {
		const data = await request.formData()
		const commentHtml = data.get('comment') as string
		const comment = commentHtml.replace(/</g, '&lt;') // FIXME with zod not typeguard
		return { preview: { comment, location: url.pathname, success: true } }
	},

	submitComment: async ({ locals, request, url }) => {
		const data = await request.formData()
		const commentHtml = data.get('comment') as string
		const comment = commentHtml?.replace(/</g, '&lt;')
		const name = data.get('name')
		const email = data.get('email')
		const website = data.get('website')

		const commentData = {
			domain: 'adam.nz',
			email: email,
			homepage: website,
			isApproved: false,
			location: url.pathname,
			name: name,
			text: comment,
		}

		// await locals.pb.collection('users').authWithPassword(PB_USER, PB_PASS)
		const previouslyApprovedEmail = await locals.pb.collection(pbCommentsId).getList(1, 1, {
			filter: `email = "${email}" && isApproved = true`,
		})

		if (previouslyApprovedEmail.items.length > 0) {
			commentData.isApproved = true
		}

		await locals.pb.collection(pbCommentsId).create(commentData)

		return { submit: { isApproved: commentData.isApproved, success: true } }
	},
}
