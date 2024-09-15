import type { HandleClientError } from '@sveltejs/kit'
import { dev } from '$app/environment'

export const handleError: HandleClientError = async ({ error, event, status, message }) => {
	if (dev) {
		console.error(error)
		return
	}

	try {
		fetch('https://ntfy.sh/adamnz', {
			method: 'POST',
			body: `**${status}: ${message}**

> ${error instanceof Error ? error.stack : ''}

${event.url.href}`,
			headers: {
				Title: `[CSR] ${error instanceof Error ? error.message : String(error)}`,
				// Title: `[CSR] ${error instanceof Error ? error : new Error(String(error))}`,
				Tags: `${status}, CSR, user:unknown`,
				Markdown: 'yes',
			},
		})
	} catch (apiError) {
		console.error('Error sending to API:', apiError)
	}
	console.error(error)
}
