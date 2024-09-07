import { getRandomPbImageUrl } from '$lib/utils'

export const load = async ({ locals }) => {
	const contactLols = 'kiochbanomkj7zi'
	return await getRandomPbImageUrl(contactLols, '512x0')
}
