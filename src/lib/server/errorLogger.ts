// setting up telegram bot
// go to botfather and send `/newbot`
// click on link to go to new channel and send message
// get result.chat.id from https://api.telegram.org/bot${TOKEN}/getUpdates

import { env } from '$env/dynamic/private'

interface ErrorInfo {
	type: string
	status: number
	message: string
	error: Error
	url: string
	user: string
}

export async function sendErrorToTelegram(errorInfo: ErrorInfo) {
	const message = `
Type: ${errorInfo.type}
User: ${errorInfo.user}
Status: ${errorInfo.status}
URL: ${errorInfo.url}
Message: ${errorInfo.message}
Error: ${errorInfo.error.message}
Stack: ${errorInfo.error.stack}
  `
	const url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

	try {
		console.log('Attempting to send error to Telegram:', message)
		console.log('Telegram API URL:', url.replace(env.TELEGRAM_BOT_TOKEN, 'HIDDEN_TOKEN'))

		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				chat_id: env.TELEGRAM_CHAT_ID,
				text: message,
			}),
		})

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
			const responseJson = await response.json()
			console.log('Successfully sent error to Telegram', responseJson)
		}
	} catch (e) {
		console.error('Error sending error to Telegram:', e)
		console.error('Error stack:', e.stack)
	}
}
