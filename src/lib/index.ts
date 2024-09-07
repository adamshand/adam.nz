import md5 from 'md5'

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

export const getGravatarUrl = (email: string) => {
	const hash = md5(email.trim().toLowerCase())
	return `https://gravatar.com/avatar/${hash}`
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
