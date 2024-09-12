// setting up telegram bot
// go to botfather and send `/newbot`
// click on link to go to new channel and send message
// get result.chat.id from https://api.telegram.org/bot${TOKEN}/getUpdates

import { env } from '$env/dynamic/private'

interface ErrorInfo {
	type: string
	// errorId: string
	status: number
	message: string
	error: Error
	url: string
}

// Error ID: ${errorInfo.errorId}

export async function sendErrorToTelegram(errorInfo: ErrorInfo) {
	const message = `
Type: ${errorInfo.type}
Status: ${errorInfo.status}
URL: ${errorInfo.url}
Message: ${errorInfo.message}
Error: ${errorInfo.error.message}
Stack: ${errorInfo.error.stack}
  `

	try {
		console.log('Attempting to send error to Telegram:', message)

		const response = await fetch(
			`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					chat_id: env.TELEGRAM_CHAT_ID,
					text: message,
				}),
			},
		)

		if (!response.ok) {
			const responseText = await response.text()
			console.error(
				'Failed to send error to Telegram. Status:',
				response.status,
				'Response:',
				responseText,
			)
			throw new Error(`HTTP error! status: ${response.status}`)
		} else {
			console.log('Successfully sent error to Telegram')
		}
	} catch (e) {
		console.error('Error sending error to Telegram:', e)
	}
}
