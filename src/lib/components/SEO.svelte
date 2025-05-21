<script lang="ts">
	import { decodeHtmlEntities, siteName, siteUrl } from '$lib/utils'
	import { page } from '$app/state'

	interface Props {
		sitename?: string
		location?: string
		title?: string
		imageUrl?: string
		description?: string
		author?: string
		copyright?: string
	}

	let {
		sitename = siteName,
		location = '',
		// location = page.url.pathname,
		title = '',
		imageUrl = '',
		description = "I'm a nerd, facilitator, and gardener based on New Zealand's Kāpiti Coast.",
		author = 'Adam Shand',
		copyright = 'Copyheart ♥ 1994–2023 sharing is an act of love.',
	}: Props = $props()

	// I think this is a bug: https://github.com/sveltejs/svelte/issues/12874
	if (location === '') location = page.url.pathname

	// const json = {
	// 	'@context': 'https://schema.org',
	// 	'@type': 'BlogPosting',
	// 	author: {
	// 		'@type': 'Person',
	// 		name: author,
	// 	},
	// 	dateCreated: post.created,
	// 	dateModified: post.updated,
	// 	description: description,
	// 	headline: title,
	// 	image: imageUrl,
	// 	url: siteUrl + location,
	// }

	// const pageTitle = $state(decodeHtmlEntities(title.replace(/<[^>]>/g, '')))
	// const pageDescription = $state(decodeHtmlEntities(description.replace(/<[^>]>/g, '')))
	title = decodeHtmlEntities(title.replace(/<[^>]>/g, ''))
	description = decodeHtmlEntities(description.replace(/<[^>]>/g, ''))
</script>

<svelte:head>
	<link href="{siteUrl}{location}" rel="canonical" />
	<meta content="{siteUrl}{location}" property="og:url" />
	<meta content="website" property="og:type" />
	<meta content={sitename} name="apple-mobile-web-app-title" />
	<meta content={sitename} property="og:site_name" />

	<title>{sitename}: {title}</title>
	<meta content="{sitename}: {title}" property="og:title" />
	<meta content="{sitename}: {title}" name="twitter:title" />

	{#if description}
		<meta content={description} property="og:image:alt" />
		<meta content={description} property="og:description" />
		<meta content={description} name="twitter:description" />
		<meta content={description} name="twitter:image:alt" />
	{/if}

	{#if imageUrl}
		<meta content="summary_large_image" name="twitter:card" />
		<meta content={imageUrl} property="og:image" />
		<meta content={imageUrl} name="twitter:image:src" />
	{/if}

	<meta content={author} name="author" />
	<meta content={copyright} name="copyright" />
	<link href="/sitemap" rel="sitemap" type="application/html" />

	<!-- FIXME: this doesn't work, not sure why yet.
		<script type="application/ld+json">
		{
			JSON.stringify(json, null, 2)
		}
	</script> -->
</svelte:head>

<!-- JSON-LD examples: https://jsonld.com/blog-post/ -->
<!-- 
"alternativeHeadline": "and the women who love them",
"articleBody": "You can paste your entire post in here, and yes it can get really really long.",
"genre": "search engine optimization", 
"keywords": "seo sales b2b", 
"wordcount": "1120",
"publisher": "Book Publisher Inc",
"datePublished": "2015-09-20",
"dateCreated": "2015-09-20",
"dateModified": "2015-09-20", 
-->
