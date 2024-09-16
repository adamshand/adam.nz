import type { HandleServerError } from '@sveltejs/kit'
import type { TypedPocketBase } from '$lib/types'

import { dev } from '$app/environment'
import { env } from '$env/dynamic/public'
import { Security } from '$lib/pocketbase.svelte'
import { blockUrlParamsRegex, blockUrlPathRegex, pbUrl } from '$lib/utils'
import { sendErrorToNtfy } from '$lib'

import { error } from '@sveltejs/kit'
import PocketBase from 'pocketbase'

export const handle = async ({ event, resolve }) => {
	if (blockUrlPathRegex.test(event.url.pathname)) error(403, 'Bad bot, no cookie.')
	if (blockUrlParamsRegex.test(event.url.search)) error(403, 'Bad bot, no cookie?')

	event.locals.pb = new PocketBase(env.PUBLIC_POCKETBASE_URL) as TypedPocketBase
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '')

	// dev && console.log('hooks.server: ', locals.pb.authStore.model);
	try {
		// TODO: add else {} to login as bot ??
		if (event.locals.pb.authStore.isValid) {
			await event.locals.pb.collection('users').authRefresh()
			event.locals.user = event.locals.pb.authStore.model
		}
	} catch (err) {
		console.error('Error during PocketBase .authRefresh():', err) // Log the error
		event.locals.pb.authStore.clear()
		event.locals.user = null
	}

	// Must always run, and run after .loadFromCookie() & .authRefresh()
	event.locals.security = new Security(event)

	const response = await resolve(event)

	// httpOnly = false is required for realtime to get the cookie (see verify/+page.svelte)
	response.headers.set(
		'set-cookie',
		event.locals.pb.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax', secure: !dev }),
	)
	return response
}

export const handleError: HandleServerError = async ({ error, event, message, status }) => {
	console.error(error)
	sendErrorToNtfy(error, event, message, status, true)
}
