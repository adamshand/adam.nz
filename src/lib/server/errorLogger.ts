import { env } from '$env/dynamic/private'
import axios from 'axios'
import dns from 'dns'

// Set explicit DNS servers (example using Google's public DNS)
dns.setServers(['8.8.8.8', '8.8.4.4'])

// Adjust Node.js DNS settings
dns.setDefaultResultOrder('ipv4first')

export async function sendErrorToTelegram(errorInfo) {
	const message = `
Type: ${errorInfo.type} (Axios)
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

		const response = await axios.post(
			url,
			{
				chat_id: env.TELEGRAM_CHAT_ID,
				text: message,
			},
			{
				timeout: 10000, // 10 seconds timeout
				headers: {
					'Content-Type': 'application/json',
				},
			},
		)

		console.log('Successfully sent error to Telegram', response.data)
		return response.data
	} catch (error) {
		console.error('Error sending error to Telegram:', error)
		if (error.response) {
			console.error('Response data:', error.response.data)
			console.error('Response status:', error.response.status)
			console.error('Response headers:', error.response.headers)
		} else if (error.request) {
			console.error('No response received:', error.request)
		} else {
			console.error('Error setting up request:', error.message)
		}
		console.error('Error config:', error.config)
		throw error
	}
}
