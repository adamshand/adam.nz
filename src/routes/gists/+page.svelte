<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'

	import Gist from '$lib/components/Gist.svelte'
	import SEO from '$lib/components/SEO.svelte'

	const imageUrl = `https://pb.haume.nz/api/files/amu003xvt8ezymb/7fistbep3n9u5f8/gists_V5xpVEookv.webp`
	const location = '/gists'
	const title = '101 Recently Updated Gists'
	const description =
		'When I was learning Unix in the early nineties I struggled to understand and remember the syntax of commandline tools. To help myself learn, each time I discovered a new command, I’d record each new success so I had a known good starting point for the next time.'

	let { data }: { data: { gists: PostType[] } } = $props()
</script>

<SEO {description} {imageUrl} {location} {title} />

<img
	alt="A man casting a shadow over a wall covered in project nerdy text."
	id="feature"
	src={imageUrl}
/>

<!-- <aside> looks nicer but right float fucks with layout -->
<div>
	<p>
		When I was learning Unix in the early nineties I struggled to understand and remember the syntax
		of commandline tools. To help myself learn, each time I discovered a new command, I’d record
		each new success so I had a known good starting point for the next time.
	</p>
	<p>
		Initially I kept these notes in <code>~/etc/</code> so they were easy to <code>grep</code>.
		Later they moved to a wiki page where they continued to flourish, and then finally to my
		WordPress site where they languished … until (hopefully) now!
	</p>
	<p>Over the years I've kept the habit because it continues to be useful.</p>
</div>
<!-- </aside> -->

<h2>{title}</h2>

{#each data.gists as gist}
	<Gist {gist} />
{/each}

<style>
	img {
		width: 100%;
		margin-bottom: 1rem;
	}
</style>
