// import type { HandleClientError } from '@sveltejs/kit'
// import { sendErrorToTelegram } from '$lib/errorLogger'

// export const handleError = async ({ error, event, status, message }) => {
// 	console.log('hooks.client: ', error)
// 	await sendErrorToTelegram({
// 		type: 'Client Error',
// 		user: 'unknown (csr)',
// 		status,
// 		message,
// 		error: error instanceof Error ? error : new Error(String(error)),
// 		url: event.url.pathname + event.url.search,
// 	})

// 	return {
// 		message: 'An unexpected client error occurred',
// 	}
// }
