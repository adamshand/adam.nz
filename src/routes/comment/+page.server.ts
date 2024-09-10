import { PB_PASS, PB_USER } from '$env/static/private'
import { pbCommentsId } from '$lib/utils'
import { pbUrl } from '$lib/utils'
import PocketBase from 'pocketbase'

export const actions = {
	preview: async ({ request, url }) => {
		const data = await request.formData()
		const html = data.get('comment') as string
		const location = data.get('location') as string
		const comment = html.replace(/</g, '&lt;')
		const title = data.get('title') as string

		return { preview: { comment, location, title, success: true } }
	},

	submit: async ({ fetch, request, url }) => {
		const form = await request.formData()
		const html = form.get('comment') as string
		const text = html?.replace(/</g, '&lt;')
		const name = form.get('name')
		const email = form.get('email')
		const homepage = form.get('homepage')
		const location = form.get('location')

		const comment = {
			domain: 'adam.nz',
			email: email,
			homepage,
			isApproved: false,
			location,
			name: name,
			text,
		}

		const pb = new PocketBase(pbUrl)
		const auth = await pb.collection('users').authWithPassword(PB_USER, PB_PASS)

		const previouslyApprovedEmail = await pb.collection(pbCommentsId).getList(1, 1, {
			filter: `email = "${email}" && isApproved = true`,
		})

		if (previouslyApprovedEmail.items.length > 0) {
			comment.isApproved = true
		}

		// TODO: could add a new column 'isSpam' or 'isBlocked' and check for existing email addresses that have been blocked.  Maybe refactor users into their own collection?
		const result = await pb.collection(pbCommentsId).create(comment)

		return { submit: { comment: result, success: true } }
	},
}
