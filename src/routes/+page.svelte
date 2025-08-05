<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { ImageSets, PostType } from '$lib/types'

	import PostsIndex from '$lib/components/PostsIndex.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import SocialIcons from '$lib/components/SocialIcons.svelte'
	// function genBlurb() {
	// 	let html = ''
	// 	let interests = [
	// 		{ link: '/links/aphantasia', title: 'aphantasia' },
	// 		{
	// 			links: [
	// 				{ link: '/permaculture/nz', title: 'Permaculture' },
	// 				{ link: '/syntropy', title: 'Syntropic Agriculture' },
	// 				{ link: '/holistic-management', title: 'Holistic Management' },
	// 			],
	// 			title: 'regenerative agriculture',
	// 		},
	// 		{
	// 			links: [
	// 				{ link: '/managers', title: 'Managers Anonymous' },
	// 				{ link: '/links/nvc', title: 'Nonviolent Communication' },
	// 			],
	// 			title: 'management & leadership',
	// 		},
	// 		{
	// 			links: [
	// 				{ link: '/links/meditation', title: 'vipassanā' },
	// 				{ link: '/links/breathwork', title: 'breathwork' },
	// 			],
	// 			title: 'meditation',
	// 		},
	// 		{ links: [{ link: '/carnivore/story', title: 'Carnivore Diet' }], title: 'food as medicine' },
	// 		{
	// 			links: [
	// 				{ link: '/quotes', title: 'quotes' },
	// 				{ link: '/gists', title: 'gists' },
	// 			],
	// 			title: 'collecting',
	// 		},
	// 		{
	// 			links: [
	// 				{ link: '/links/opensource', title: 'open source' },
	// 				{ link: 'https://learn.svelte.dev', title: 'Svelte' },
	// 				{ link: '/decentralisation', title: 'decentralisation' },
	// 			],
	// 			title: 'technology',
	// 		},
	// 		{
	// 			links: [
	// 				{ link: '/writing/poems', title: 'poems' },
	// 				{ link: '/writing/vignettes', title: 'vignettes' },
	// 				{ link: '/writing/tutorials', title: 'tutorials' },
	// 			],
	// 			title: 'writing',
	// 		},
	// 	]

	// 	shuffle(interests)

	// 	for (let j = 0; j < interests.length; j++) {
	// 		if (interests[j].link) {
	// 			html += `<a href="${interests[j].link}">${interests[j].title}</a>`
	// 		} else if (interests[j].links.length > 0) {
	// 			shuffle(interests[j].links)
	// 			html += `<strong>${interests[j].title}</strong> (`
	// 			for (let i = 0; i < interests[j].links.length; i++) {
	// 				html += `<a href="${interests[j].links[i].link}">${interests[j].links[i].title}</a>`
	// 				if (i < interests[j].links.length - 2) {
	// 					html += ',&ensp;'
	// 				} else if (i < interests[j].links.length - 1) {
	// 					html += ' &amp; '
	// 				}
	// 			}
	// 			html += `)`
	// 		}
	// 		if (j < interests.length - 2) {
	// 			html += ',&ensp;'
	// 		} else if (j < interests.length - 1) {
	// 			html += ' and '
	// 		}
	// 	}
	// 	return html
	// }

	type HeroImages = {
		[key: string]: { record: string; url: string }
	}

	interface MyProps {
		data: {
			quote: PostType
			images: HeroImages
		}
	}

	let { data }: MyProps = $props()

	const imageUrl = data.images.adam.url
	const location = '/'
	const title = 'kia ora'
</script>

<SEO {imageUrl} {location} {title} />

<section>
	<div id="photos">
		{#each ['adam', 'cute', 'lols'] as hero}
			<a
				onclick={() => window.umami?.track(`/ <Random ${hero} Photo>`, { hero })}
				href={`${data.images[hero].url}?thumb=512x0`}
			>
				<img
					alt={`Random ${hero} photo`}
					id={hero}
					src="{`${data.images[hero].url}?thumb=1024x0`}}"
				/>
			</a>
		{/each}
	</div>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		id="quote"
		onclick={() =>
			window.umami?.track('/ <RandomQuote>', { quote: data.quote.content, id: data.quote.id })}
	>
		<Quote fullWidth quote={data.quote} showDetails={false} />
	</div>

	<SocialIcons />

	<div id="posts">
		<div id="recent">
			<h2>Recent Posts</h2>
			<PostsIndex maxPosts={11} showMeta={false} />
		</div>
		<div id="popular">
			<h2>Popular Posts</h2>
			<PostsIndex maxPosts={9} showMeta={false} sortByViews={true} />
		</div>
	</div>
</section>

<!-- <p>&nbsp;</p> -->

<!-- <p>I'm a gardener, nerd, facilitator, and writer living on New Zealand's Kāpiti Coast.</p> -->

<!-- <div id="blurb">
		Things that interest me are {@html genBlurb()}.
	</div> -->

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
		margin-top: 1rem; /* for angled photos */
	}
	#photos {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
		rotate: -0.8deg;
	}
	#photos a {
		flex: 1 0 calc(33.33% - 7px);
	}
	#photos img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: var(--borderRadius);
	}

	#quote {
		width: 80%;
		margin-bottom: 0;
		text-align: center;
	}
	#posts {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 98%;
		/* border: 1px solid cornflowerblue; */
	}
	#recent {
		width: 50%;
		padding-right: 2rem;
		border-right: 1px dashed var(--darkContrast);
	}
	#popular {
		width: 50%;
		padding-left: 2rem;
		text-align: right;
	}
	/* :global(.blurb) {
		color: var(--light);
	}
	:global(.blurb strong) {
		font-weight: 200;
		color: var(--accent);
	}
	:global(.blurb a) {
		text-decoration-style: dotted;
		color: var(--lightContast);
	}
	:global(.blurb a:hover) {
		color: var(--accentHover);
	} */
	@media (max-width: 768px) {
		/* and (min-width: 415px) { */
		#photos a {
			flex: 1 0 48%;
		}
		/* #photos a:first-child {
			flex: 1 0 100%;
		} */
		#photos a:last-child {
			display: none;
		}
		#posts {
			flex-direction: column;
			align-items: center;
			gap: 2rem;
		}
		#recent,
		#popular {
			width: 90%;
			padding: 0;
			text-align: center;
			border: none;
		}
	}
	@media (max-width: 415px) {
		#photos a {
			display: none;
		}
		#photos a:first-child {
			display: block;
			flex: 1 0 100%;
			rotate: 2deg;
		}
		#quote {
			width: 90%;
		}
	}
</style>
