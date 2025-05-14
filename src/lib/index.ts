import { browser, dev, version } from '$app/environment'
import type { NavigationEvent, RequestEvent } from '@sveltejs/kit'

export const tagRegex = /[A-Za-z][A-Za-z0-9_-]*($|\s)/
export const hashTagRegex = new RegExp(`#${tagRegex}`)

export function checkTag(tag: string, hash = false) {
	return hash ? hashTagRegex.test(tag) : tagRegex.test(tag)
}

export const toDateTimeLocalString = (d: Date | string) => {
	// Format required by <input type="datetime-local" ... />
	const date = typeof d === 'string' ? new Date(d) : d
	if (isNaN(date.getTime())) {
		throw new Error('Invalid input date')
	}

	const year = date.getFullYear()
	const month = (date.getMonth() + 1).toString().padStart(2, '0')
	const day = date.getDate().toString().padStart(2, '0')
	const hours = date.getHours().toString().padStart(2, '0')
	const minutes = date.getMinutes().toString().padStart(2, '0')

	return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const formatLocalDateTime = (d: Date | string) => {
	const date = typeof d === 'string' ? new Date(d) : d
	if (isNaN(date.getTime())) {
		throw new Error('Invalid input date')
	}

	const locale = navigator.language
	const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone
	return new Date(d).toLocaleString(locale, {
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		month: 'short',
		timeZone,
		year: 'numeric',
	})
}

export const formatLocalDate = (d: Date | string) => {
	const date = typeof d === 'string' ? new Date(d) : d
	if (isNaN(date.getTime())) {
		throw new Error('Invalid input date')
	}

	const locale = navigator.language
	const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone
	return new Date(d).toLocaleDateString(locale, {
		day: 'numeric',
		month: 'short',
		timeZone,
		year: 'numeric',
	})
}

// export function getOpenmojiUrl(id: string, { color = true } = {}) {
export function getOpenmojiUrl(id: string, palette: 'black' | 'color' = 'color') {
	const baseUrl = 'https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji'
	// const baseUrl = 'https://unpkg.com/openmoji';
	return `${baseUrl}/${palette}/svg/${id}.svg`
}

export const getRandomElement = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)]
}

export const isValidEmail = (email: string) => {
	return /^[^@\s]+@[^@\s]+\.[^@\s]+/.test(email)
}

export function stripHtml(str: string) {
	return str.replace(/<\/?[^>]+(>|$)/g, '').trim()
}

export async function sendErrorToNtfy(
	error: unknown,
	event: RequestEvent | NavigationEvent,
	message: string,
	status: number,
	runInDev = false,
) {
	if (dev && runInDev === false) {
		console.error(error)
		return { message }
	}

	if (status === 404) {
		console.error(error)
		return { message }
	}

	// const id = crypto.randomUUID() // maybe later
	// this is the right thing, but need to figure out  how to auto subscribe
	// const ntfyTopic = `${event.url.hostname}-${version}`
	const ntfyTopic = `${event.url.hostname.replace(/[.]/g, '-')}-4327a`
	const ntfyUrl = `https://ntfy.sh/${ntfyTopic}?auth=tk_39wjfjv3i5hycpnc3ot33svzo1vta`

	const errorMsg = error instanceof Error ? error.message : String(error)
	const stack = error instanceof Error ? error.stack : 'no stack'

	const location = `[${event.url.href}](${event.url.href})`
	const renderMode = browser ? 'CSR' : 'SSR'
	const user = `@${(event as any).locals?.user?.username ?? 'anonymous'}`

	const body = `**${status}: ${message}**\n\n${stack}\n\n${location}`

	console.log({ ntfyUrl, renderMode, user })

	const headers = {
		Markdown: 'yes',
		Tags: `${browser ? 'facepalm' : 'boom'}, ${status}, ${renderMode}, ${user}, ${version}`,
		Title: errorMsg.replace(/[^\x00-\x7F]/g, '?'),
	}

	try {
		// don't need to await because we aren't using result
		await fetch(ntfyUrl, {
			body,
			headers,
			method: 'POST',
		})
	} catch (apiError) {
		//  since i don't await the fetch, is this any use?
		console.error('Error sending to ntfy:', apiError)
	}
}
