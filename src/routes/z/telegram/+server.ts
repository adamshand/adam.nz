import { json } from '@sveltejs/kit'
import { sendErrorToTelegram } from '$lib/server/errorLogger'

export async function GET() {
	try {
		await sendErrorToTelegram({
			type: 'Test Error',
			status: 200,
			user: 'Test User',
			url: '/test-telegram',
			message: 'This is a test error',
			error: new Error('Test error message'),
		})
		return json({ success: true })
	} catch (error) {
		console.error('Error in test route:', error)
		return json({ success: false, error: error?.message })
	}
}
