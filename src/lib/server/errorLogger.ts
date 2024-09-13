import https from 'https'
import dns from 'dns'

import { env } from '$env/dynamic/private'
import { formatLocalDateTime } from '$lib'

type Message = {
	type: string
	user: string
	status: number
	url: string
	message: string
	error: Error
}

export async function sendErrorToTelegram(errorInfo: Message) {
	// <sigh> manually resolving dns to get the v4 ip address because node preferentially tries to use telegram's v6
	// ip and the docker container doessn't suport v6. resolv.conf hacks to disable ipv6 don't work in alpine and enabling
	// v6 in docker seemed to require setting up 4to6 NAT which I couldn't be bothered doing.
	// setting setDefaultResultOrder('ipv4first') should work, but it doesn't.

	const hostname = 'api.telegram.org'
	const path = `/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`

	// Type: ${errorInfo.type}
	const message = `###################################
##### ERROR: ${formatLocalDateTime(new Date())} #####

URL: ${errorInfo.url} (${errorInfo.user})
Message: (${errorInfo.status}) ${errorInfo.message}
Error: ${errorInfo.error.message}

Stack: ${errorInfo.error.stack}`

	dns.setDefaultResultOrder('ipv4first')
	dns.resolve4(hostname, (err, addresses) => {
		if (err) {
			console.error('DNS resolution error:', err)
			return
		}

		console.log(`Resolved ${hostname} to:`, addresses)

		const payload = JSON.stringify({
			chat_id: env.TELEGRAM_CHAT_ID,
			text: message,
			silent: true,
		})

		const options = {
			hostname: addresses[0],
			port: 443,
			path: path,
			method: 'POST',
			headers: {
				Host: hostname,
				'Content-Type': 'application/json',
				'Content-Length': Buffer.byteLength(payload),
			},
			family: 4, // doesn't seem necessary
			timeout: 5000,
		}

		const req = https.request(options, (res) => {
			// console.log('StatusCode:', res.statusCode)
			// console.log('Headers:', res.headers)
			// let data = ''
			// res.on('data', (chunk) => {
			// 	data += chunk
			// })
			// res.on('end', () => {
			//  console.log('Response body:', data)
			// })
		})

		req.on('error', (e) => {
			console.error('Request error:', e)
		})

		req.on('timeout', () => {
			console.error('Request timed out')
			req.destroy()
		})

		req.write(payload)
		req.end()
	})
}
