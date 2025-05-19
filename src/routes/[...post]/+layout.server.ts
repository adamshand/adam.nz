import type { CommentType, PostType } from '$lib/types.js'

import { isDebug, pbAdamnzId, pbCommentsId, pbLogsId, pbUrl, urlRedirectsMap } from '$lib/utils'
import { error, redirect } from '@sveltejs/kit'
import { pbError } from '$lib/pocketbase.svelte'
import { incrementViews } from '$lib/server/pocketbase.svelte.js'

const year = '\\d{4}'
const archives = 'archives?'
const blog = 'blog'
const library = 'library'
const asn = 'asn/(archives|iki|library)'
const wiki = 'wiki'
const oldPostsRegex = new RegExp(`^/(${year}|${archives}|${blog}|${library}|${asn}|${wiki})/`)

export const load = async ({ fetch, locals, request, url }) => {
	let post: PostType[] = []
	let comments: CommentType[] = []

	try {
		post = await locals.pb.collection(pbAdamnzId).getFullList({
			fetch,
			filter: `location = "${url.pathname}"`,
		})

		const nonAdminFilter = locals.user?.admin ? '' : '&& isApproved = true'
		comments = locals.pb.collection(pbCommentsId).getFullList({
			fetch,
			// return everything but email so it doesn't leak to the clients
			fields:
				'id, collectionId, collectionName, created, updated, text, name, gravatar, homepage, isApproved, domain, location,',
			filter: `domain = "adam.nz" && location = "${url.pathname}" ${nonAdminFilter}`,
			sort: '-created',
		})
	} catch (e) {
		console.error('/+layout.server: error getting post or comments', e)
		pbError(e)
	}

	if (post.length === 1) {
		if (!locals?.user) {
			incrementViews(post[0])
		}

		// TODO: stream comments so post loads faster
		return {
			comments: comments,
			post: post,
		}
	} else if (/^\/\d{4}\/?$/.test(url.pathname)) {
		// redirect /2022/? to /posts/2022
		const newUrl = '/posts' + url.pathname
		redirect(308, newUrl)
		// } else if (/^\/quotes\/\d{4}\/?$/.test(url.pathname)) {
		// 	// redirect /quotes/2022/? to /quotes
		// 	redirect(308, '/quotes')
	} else if (/^\/.+\/start\/?$/.test(url.pathname)) {
		// redirect dokuwiki /pagename/start to  /pagename
		const newUrl = url.pathname.replace(/\/start\/?$/, '')
		redirect(308, newUrl)
	} else if (oldPostsRegex.test(url.pathname)) {
		// removes /2022, /archives?, /blog & /library from url and redirects
		const newUrl = '/' + url.pathname.replace(oldPostsRegex, '')
		redirect(308, newUrl)
	} else if (url.pathname.includes('_')) {
		const newUrl = url.pathname.replace(/_/g, '-')
		redirect(308, newUrl)
	} else if (url.pathname in urlRedirectsMap) {
		redirect(308, urlRedirectsMap[url.pathname])
	} else if (/^\/page\/\d+/.test(url.pathname)) {
		// redirect wordpress /page/4/ to /posts
		redirect(308, '/posts')
	} else {
		if (isDebug) console.log(`url not found: ${url.pathname} ${url.search}`)
		const r = {
			date: new Date(),
			log: url.pathname + '/' + url.search,
			referer: request.headers.get('referer'),
			type: '404',
			user_agent: request.headers.get('user-agent'),
		}
		// Think this is probably broken due to auth
		await locals.pb.collection(pbLogsId).create(r, { $autoCancel: false })
		error(404, 'Page not found')
	}
}
