import { env } from '$env/dynamic/private'
import https from 'https'

export async function sendErrorToTelegram(errorInfo) {
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

		const data = JSON.stringify({
			chat_id: env.TELEGRAM_CHAT_ID,
			text: message,
		})

		return new Promise((resolve, reject) => {
			const req = https.request(
				url,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'Content-Length': data.length,
					},
					timeout: 10000, // 10 seconds timeout
				},
				(res) => {
					let responseBody = ''

					res.on('data', (chunk) => {
						responseBody += chunk
					})

					res.on('end', () => {
						if (res.statusCode >= 200 && res.statusCode < 300) {
							console.log('Successfully sent error to Telegram', responseBody)
							resolve(responseBody)
						} else {
							console.error(
								'Failed to send error to Telegram. Status:',
								res.statusCode,
								'Response:',
								responseBody,
							)
							reject(new Error(`HTTP error! status: ${res.statusCode}`))
						}
					})
				},
			)

			req.on('error', (error) => {
				console.error('Error sending error to Telegram:', error)
				reject(error)
			})

			req.on('timeout', () => {
				req.destroy()
				console.error('Request to Telegram API timed out')
				reject(new Error('Request to Telegram API timed out'))
			})

			req.write(data)
			req.end()
		})
	} catch (e) {
		console.error('Error sending error to Telegram:', e)
		console.error('Error stack:', e.stack)
		throw e
	}
}
