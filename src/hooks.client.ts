import type { HandleClientError } from '@sveltejs/kit'
import { sendErrorToNtfy } from '$lib'

export const handleError: HandleClientError = async ({ error, event, message, status }) => {
	console.error(error)
	sendErrorToNtfy(error, event, message, status, true)

	// used by +error.svelte
	return { message }
}
