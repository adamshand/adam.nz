<script lang="ts">
	import type { PostType } from '$lib/types'

	import { page } from '$app/state'
	import PostsIndex from '$lib/components/PostsIndex.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data }: { data: { quotes: PostType[] } } = $props()
	const tag = page.params.tag
</script>

<SEO imageUrl="" title="Posts tagged {tag}" />

<h1>Searching for #{tag}</h1>

<h2>Posts</h2>
<PostsIndex {tag} />

<h2>Quotes</h2>
{#each data.quotes as quote}
	<div>
		<Quote {quote} />
	</div>
{/each}

<style>
	h2 {
		margin-top: 1rem;
		padding: 0.2em 0.5em;
		background-color: var(--darkContrast);
	}
	div {
		margin-top: 1rem;
	}
</style>
