import { redirect } from '@sveltejs/kit'

const currentYear = new Date().getFullYear()

export const load = async () => {
	redirect(307, `/quotes/${currentYear}`)
}
