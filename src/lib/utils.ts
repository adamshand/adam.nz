import PocketBase from 'pocketbase'
import { env } from '$env/dynamic/public'

export const siteName = 'adam.nz'
export const siteUrl = 'https://adam.nz'
export const pbUrl = env.PUBLIC_POCKETBASE_URL
// export const pbUrl = 'https://pb.haume.nz'
// export const pbUrl = 'https://pocketbase.app.haume.nz'
export const pbAdamnzId = 'xd6xm0awdmqjjln'
export const pbImagesId = 'amu003xvt8ezymb'
export const pbCommentsId = 'fprxud5l8hertvs'
export const pbLogsId = '99lbaf0v9vfj5am'
export const isDebug = false

export const yearRegex = /^\d{4}$/
export const blockUrlParamsRegex = /(action|calparms|do|highlight|rev)=/
export const blockUrlPathRegex =
	/wordpress|wp-(admin|content|json|includes|login|secvrity)|wp2|\.env|\.php|\.sql|\.git|src|cdn.js|\.vscode|asn\/\.well-known|wiki\/HelpOn|(ads|security)\.txt|.*\/feed$|index\.rss|^\/-/

export const urlRedirectsMap: Record<string, string> = {
	'/%2A': '/',
	// IMPORTANT: all _ converted to - in src/routes/[...post]/+layout.server.ts
	'/*': '/',
	'/a-caterpillar-crisis': '/caterpillar-crisis',
	'/a-cypherpunks-manifesto': '/cypherpunks-manifesto',
	'/a-realistic-calendar': '/realistic-calendar',
	'/a-realistic-calendar-for-new-zealand': '/realistic-calendar',
	'/a-realistic-wellington-calendar': '/realistic-calendar',
	'/about': '/my/story',
	'/about/biographies': '/my/biographies',
	'/about/media': '/my/scrapbook',
	'/about/scrapbook': '/my/scrapbook',
	'/about/story': '/my/story',
	'/about/testimonials': '/managers',
	'/all-about-rice-tea': '/rice-tea',
	'/anne-waldman-hopes-fears': '/hopes-and-fears',
	'/asn': '/',
	'/asn/2006/apache-and-active-directory': '/apache-and-active-directory',
	'/asn/2008/apache-tips-and-tricks': '/apache-tips-and-tricks',
	'/asn/2008/you-are-a-den-of-vipers-and-thieves': '/quotes/id/p0j9tmlwdbv6v3p',
	'/asn/2009/selecting-java-version-on-mac-osx-10-5-leopard':
		'/selecting-java-version-on-mac-osx-10-5-leopard',
	'/asn/ikiwiki.cgi': '/posts',
	'/asn/index/all.rss': '/rss.xml',
	'/asn/library/red-head-facts': '/red-head-facts',
	'/asn/planet/index.rss': '/rss.xml',
	'/asn/vade-mecum': '/gists',
	'/bill-watterson-kenyon-commencement': '/glimpsed-it-and-fled',
	'/blog': '/posts',
	'/category/commentary': '/posts/commentary',
	'/category/journal': '/posts/journal',
	'/category/library': '/posts/archive',
	'/category/poem': '/posts/poem',
	'/category/portfolio': '/projects',
	'/category/quote': '/quotes',
	'/category/story/vignette': '/posts/vignette',
	'/category/travel': '/search/tag/travelling',
	'/category/vignette': '/posts/vignette',
	'/contact/key': 'https://github.com/adamshand.gpg',
	'/dokuwiki': '/posts',
	'/ecosystems-matter': '/eating-matters',
	'/essays/commandline.html': '/in-the-beginning-was-the-command-line',
	'/eva-zeisel-the-playful-search-for-beauty': '/the-playful-search-for-beauty',
	'/feed': '/rss.xml',
	'/george-carlin-save-the-planet': '/save-the-planet',
	'/getting-spamassassin-to-trust-authenticated-smtp-clients': '/spamassassin',
	'/greg-bear-blood-music': '/blood-music',
	'/hello': '/',
	'/hireme': '/hire-me',
	'/home': '/',
	'/how-we-solve-problems': '/solving-problems',
	'/in-the-beginning-was-the-command': '/in-the-beginning-was-the-command-line',
	'/index.rss': '/rss.xml',
	'/italian/wirelessguide/capitolo8': '/wireless-commons',
	'/keynote-on-gifted-children': '/gifted-and-talented-children',
	'/lessons-learned-from-previous-employment': '/previous-employment',
	'/library': '/posts/archive',
	'/manifestos': '/posts/manifesto',
	'/my': '/my/story',
	'/never-in-the-history-of-calming-down': '/calming-down',
	'/nonviolent-communication-a-language-of-life': '/a-language-of-life',
	'/permaculture': '/permaculture/nz',
	'/permaculture/k%C4%81piti': '/permaculture/kapiti',
	'/permaculture-in-nz': '/permaculture/nz',
	'/permies': '/permaculture/kapiti',
	'/planet/index.rss': '/rss.xml',
	'/second-manifesto-of-the-space-hijackers': '/space-hijackers-manifesto',
	'/shitsville-2020': '/projects/shitsville-2020',
	'/spack': '/posts',
	'/spack/~larry/gpgkey.html': 'https://github.com/adamshand.gpg',
	'/spack/AppleOsxIntegrationWithOpenLdap': '/osx-integration-with-openldap',
	'/spack/ImmigratingToNewZealand': '/immigrating-to-new-zealand',
	'/spack/RecentChanges': '/',
	'/spack/ThinkPad390': '/thinkpad-390',
	'/spack/commandline.html': '/in-the-beginning-was-the-command-line',
	'/spack/essays/commandline.html': '/in-the-beginning-was-the-command-line',
	'/spack/geek/frontpage.html': '/frontpage-extensions',
	'/spack/geek/thinkpad-390.html': '/thinkpad-390',
	'/spack/geek/thinkpad-t20.html': '/thinkpad-t20',
	'/spack/index.cgi': '/posts',
	'/spack/index.cgi/AdamShand': '/posts',
	'/spack/index.cgi/RecentChanges': '/',
	'/spack/secure-apache.html': '/apache-tips-and-tricks',
	'/spack/wiki/AdamShand': '/posts',
	'/spack/wiki/AdamShand/MediaCoverage': '/my/scrapbook',
	'/spack/wiki/AdamShand/Presentations': '/posts',
	'/spack/wiki/AdamShand/ReadingList': '/posts',
	'/spack/wiki/AdamShand/TodoList': '/posts',
	'/spack/wiki/CategoryWriting': '/posts',
	'/spack/wiki/FavoriteQuotes': '/quotes',
	'/spack/wiki/InTheBeginningWasTheCommandLine': '/in-the-beginning-was-the-command-line',
	'/spack/wiki/MicroPauseSoftware': '/managing-wrist-pain',
	'/spack/wiki/RecentChanges': '/',
	'/spack/wiki/SaveThePlanet': '/save-the-planet',
	'/spack/wiki/TheInnerRing': '/the-inner-ring',
	'/spack/wiki/ThinkPad390': '/thinkpad390',
	'/spack/wiki/UsingSsh': '/ssh',
	'/spack/wiki/WirelessCommons/Definition': '/wireless-commons/definition',
	'/spack/wiki/WirelessCommonsManifesto': '/wireless-commons',
	'/spack/words/commandline.html': '/in-the-beginning-was-the-command-line',
	'/spack/words/zentv.html': '/zen-tv-experiment',
	'/spack/zentv.html': '/zen-tv-experiment',
	'/start': '/',
	'/syntropic-resources': '/syntropy',
	'/tag/agroforestry': '/syntropy',
	'/tag/earthlight': '/projects/earthlight',
	'/tag/manifesto': '/posts/manifesto',
	'/tag/nerd': '/search/tag/nerding',
	'/tag/regeneration': '/syntropy',
	'/tag/syntropy': '/syntropy',
	'/tag/sysadmin': '/search/tag/nerding',
	'/tag/travel': '/search/tag/travelling',
	'/testimonials': '/managers',
	'/the-bad-day': '/projects/the-bad-day',
	'/the-bad-days': '/projects/the-bad-day',
	'/the-clusterfuck-nation-manifesto': '/clusterfuck-nation-manifesto/',
	'/the-conscience-of-a-hacker': '/hacker-manifesto',
	'/the-ground-beneath-her-feet': '/id/j8s3rv6a087vdvk',
	'/the-kindness-of-strangers': '/kindness-of-strangers',
	'/the-lizard-the-catacombs-and-the-clock': '/lizard-catacombs-clock',
	'/the-old-bastards-manifesto': '/old-bastards-manifesto',
	'/the-ones-who-walk-away-from-omelas': '/omelas',
	'/the-users-guide-to-steampunk': '/guide-to-steampunk',
	'/theyre-made-out-of-meat': '/made-of-meat',
	'/thinkpad390': '/thinkpad-390',
	'/thinkpadt20': '/thinkpad-t20',
	'/vade': '/gists',
	'/web': '/',
	'/welcome': '/',
	'/wiki/dokuwiki': '/posts',
	'/wiki/hello': '/',
	'/wiki/permaculture': '/permaculture/nz',
	'/wildfire-permaculture-designers-manual': '/wildfire',
	'/wireless-commons/manifesto': '/wireless-commons',
	'/wireless-commons-old/italian': '/wireless-commons',
	'/wireless-commons-old/signatories': '/wireless-commons/signatories',
	'/wireless-commons-old/wirelessguide/chapter1': '/wireless-commons',
	'/worldwide-ravers-manifesto': '/ravers-manifesto/',
	'/zen-tv-experiement': '/zen-tv-experiment',
}

export const serializeNonPOJOs = (obj: unknown) => {
	return structuredClone(obj)
}

export const asyncGetRandomElement = async (arr: string[]) => {
	return arr[Math.floor(Math.random() * arr.length)]
}

// export const getRandomElement = (arr: string[]) => {
// 	return arr[Math.floor(Math.random() * arr.length)]
// }

export function getRandomNumber(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export const getRandomElement = <T>(arr: T[]): T => {
	return arr[Math.floor(Math.random() * arr.length)]
}
export async function getRandomPbImageUrl(recordId: string, thumb = '') {
	const pb = new PocketBase(pbUrl)
	const data = await pb.collection(pbImagesId).getOne(recordId)
	let imageUrl = pbUrl + `/api/files/${pbImagesId}/${recordId}/` + getRandomElement(data.image)
	if (thumb) {
		imageUrl += `?thumb=${thumb}`
	}
	return { imageUrl }
}

export async function getAllPbImageUrls(recordId: string) {
	const pb = new PocketBase(pbUrl)
	const data = await pb.collection(pbImagesId).getOne(recordId)
	console.log(data)
	// const imageUrls = data.image.map((x: string) => pbUrl + `/api/files/${pbImagesId}/${recordId}/` + x)
	// return { imageUrls }
}

export const shuffle = <T>(array: T[]) => {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}

export function shuffled<T>(array: T[]): T[] {
	shuffle(array)
	return array
}

export const formatDate = (d: string) => {
	return new Date(d).toLocaleDateString('en-NZ', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	})
}

export const getDateYear = (d: string) => {
	return new Date(d).toLocaleDateString('en-NZ', {
		year: 'numeric',
	})
}

export function decodeHtmlEntities(str: string) {
	return str.replace(/&#?(\w+);/g, function (match, dec) {
		const chars = {
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Alpha: 913,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Beta: 914,
			Ccedil: 199,
			Chi: 935,
			Dagger: 8225,
			Delta: 916,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Epsilon: 917,
			Eta: 919,
			Euml: 203,
			Gamma: 915,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iota: 921,
			Iuml: 207,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Ntilde: 209,
			Nu: 925,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Omega: 937,
			Omicron: 927,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			Phi: 934,
			Pi: 928,
			Psi: 936,
			Rho: 929,
			Sigma: 931,
			THORN: 222,
			Tau: 932,
			Theta: 920,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Upsilon: 933,
			Uuml: 220,
			Xi: 926,
			Yacute: 221,
			Zeta: 918,
			aacute: 225,
			acirc: 226,
			acute: 180,
			aelig: 230,
			agrave: 224,
			alpha: 945,
			amp: 38,
			aring: 229,
			atilde: 227,
			auml: 228,
			bdquo: 8222,
			beta: 946,
			brkbar: 166,
			brvbar: 166,
			ccedil: 231,
			cedil: 184,
			cent: 162,
			chi: 967,
			clubs: 9827,
			copy: 169,
			curren: 164,
			dagger: 8224,
			darr: 8595,
			deg: 176,
			delta: 948,
			diams: 9830,
			die: 168,
			divide: 247,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			epsilon: 949,
			eta: 951,
			eth: 240,
			euml: 235,
			euro: 8364,
			frac12: 189,
			frac14: 188,
			frac34: 190,
			frasl: 47,
			gamma: 947,
			gt: 62,
			hearts: 9829,
			hellip: 8230,
			hibar: 175,
			iacute: 237,
			icirc: 238,
			iexcl: 161,
			igrave: 236,
			iota: 953,
			iquest: 191,
			iuml: 239,
			kappa: 954,
			lambda: 955,
			laquo: 171,
			larr: 8592,
			ldquo: 8220,
			lsaquo: 8249,
			lsquo: 8216,
			lt: 60,
			macr: 175,
			mdash: 151,
			micro: 181,
			middot: 183,
			mu: 956,
			nbsp: 160,
			ndash: 150,
			not: 172,
			ntilde: 241,
			nu: 957,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oline: 8254,
			omega: 969,
			omicron: 959,
			ordf: 170,
			ordm: 186,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			para: 182,
			permil: 8240,
			phi: 966,
			pi: 960,
			plusmn: 177,
			pound: 163,
			psi: 968,
			quot: 34,
			raquo: 187,
			rarr: 8594,
			rdquo: 8221,
			reg: 174,
			rho: 961,
			rsaquo: 8250,
			rsquo: 8217,
			sbquo: 8218,
			sect: 167,
			shy: 173,
			sigma: 963,
			spades: 9824,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			szlig: 223,
			tau: 964,
			theta: 952,
			thorn: 254,
			times: 215,
			trade: 8482,
			uacute: 250,
			uarr: 8593,
			ucirc: 251,
			ugrave: 249,
			uml: 168,
			upsilon: 965,
			uuml: 252,
			xi: 958,
			yacute: 253,
			yen: 165,
			yuml: 255,
			zeta: 950,
		}
		if (isNaN(Number(dec)) && chars[dec as keyof typeof chars] === undefined) {
			return match // return original matching string
		}
		dec = chars[dec as keyof typeof chars] || Number(dec)
		return String.fromCharCode(dec)
	})
}

export function cssVariables(node: HTMLElement, variables: { [key: string]: string }) {
	function setCssVariables(node: HTMLElement, variables: { [key: string]: string }) {
		for (const name in variables) {
			node.style.setProperty(`--${name}`, variables[name])
		}
	}

	setCssVariables(node, variables)

	return {
		update(variables: { [key: string]: string }) {
			setCssVariables(node, variables)
		},
	}
}

export function convert24to12(time: string) {
	const [hours, minutes] = time.split(':').map(Number)
	const date = new Date()
	date.setHours(hours, minutes)
	return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true, minute: 'numeric' })
}
