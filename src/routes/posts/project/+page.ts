// TODO: this is a dirty hack because projects aren't quite the same as posts
import { redirect } from '@sveltejs/kit'
export const load = async () => {
	redirect(301, '/projects')
}
