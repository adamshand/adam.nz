import { env } from '$env/dynamic/private'
import { pbCommentsId } from '$lib/utils'
import { pbUrl } from '$lib/utils'
import PocketBase from 'pocketbase'
import crypto from 'crypto'

export const actions = {
	preview: async ({ request }) => {
		const data = await request.formData()
		const html = data.get('comment') as string
		const location = data.get('location') as string
		const comment = html.replace(/</g, '&lt;')
		const title = data.get('title') as string

		return { preview: { comment, location, title, success: true } }
	},

	submit: async ({ request }) => {
		const form = await request.formData()
		const html = (form.get('comment') as string).trim()
		const name = (form.get('name') as string).trim()
		const email = (form.get('email') as string).trim().toLowerCase()
		const homepage = (form.get('homepage') as string).trim()
		const location = form.get('location') as string

		const text = html?.replace(/</g, '&lt;')
		const gravatar = crypto.createHash('sha256').update(email).digest('hex')

		const comment = {
			domain: 'adam.nz',
			email,
			gravatar,
			homepage,
			isApproved: false,
			location,
			name,
			text,
		}

		// doesn't use locals.pb because authing as admin
		const pb = new PocketBase(pbUrl)
		const auth = await pb.collection('users').authWithPassword(env.PB_USER, env.PB_PASS)

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
