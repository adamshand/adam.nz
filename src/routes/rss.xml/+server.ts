import type { PostType } from '$lib/types.js'
import { pbAdamnzId, pbUrl, siteName, siteUrl } from '$lib/utils'
// import PocketBase from 'pocketbase'

// TODO: can you get locals from +server.ts?
// const pb = new PocketBase(pbUrl)

export const GET = async ({ locals, setHeaders }) => {
	setHeaders({
		'Content-Type': 'application/rss+xml',
	})

	const posts = await locals.pb.collection(pbAdamnzId).getList(1, 11, {
		fields: `author, content, created, id, location, title, type`,
		filter: `title !~ 'carnivor' && type != 'gist' && type != 'meta' && type != 'project' && type != 'quote'`,
		sort: '-created',
	})

	let rss = `<?xml version="1.0" encoding="UTF-8" ?>
	<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${siteName}</title>
		<link>${siteUrl}</link>
		<description>Nerd, gardener, and writer on Wellington's Kapiti Coast</description>
		<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
		<pubDate>${new Date(posts.items[0].created).toUTCString()}</pubDate>
		<ttl>1800</ttl>
		<language>en-us</language>
		<atom:link href="https://adam.nz/rss.xml" rel="self" type="application/rss+xml" />
`
	posts.items.forEach((post: PostType) => {
		rss += `
		<item>
			<title><![CDATA[${post.title}]]></title>
			<author>${post.author === 'Adam Shand' ? 'kiaora@adam.nz' : 'null@adam.nz'} (${
				post.author
			})</author>
			<description><![CDATA[${post.content}]]></description>
			<link>${siteUrl}${post.location}</link>
			<guid isPermaLink="true">${siteUrl}/id/${post.id}</guid>
			<pubDate>${new Date(post.created).toUTCString()}</pubDate>
			<category>${post.type}</category>
		</item>`
	})

	rss += `
  </channel>
  </rss>
  `

	// return {
	//   headers: {
	//     'Content-Type': 'application/rss+xml',
	//   },
	//   body: rss,
	// };

	return new Response(String(rss))
}
