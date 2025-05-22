<script lang="ts">
	import { enhance } from '$app/forms'
	/* eslint svelte/no-at-html-tags: 0 */
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import Gist from '$lib/components/Gist.svelte'
	import PostTitle from '$lib/components/PostTitle.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()
	let q = $derived(page.url.searchParams.get('q') || '')

	function submit(e: Event) {
		e.preventDefault()
		goto(`/search?q=${encodeURIComponent(q)}`)
	}
</script>

<SEO
	author=""
	copyright=""
	description=""
	imageUrl=""
	location={page.url.pathname}
	title="Searching"
/>

<section>
	<h1>Search</h1>
	<form method="POST" onsubmit={submit}>
		<!-- svelte-ignore a11y_autofocus -->
		<input autofocus bind:value={q} name="q" placeholder="search terms" />
	</form>

	{#if data.searching.length > 0}
		<h2>{data.searching.length} results for <em>{q}</em></h2>
		{#each data.searching as post}
			<div>
				{#if post.type === 'gist'}
					<Gist gist={post} />
				{:else if post.type === 'quote'}
					<Quote quote={post} />
				{:else}
					<PostTitle isSubHeader {post} />
					<div>{@html post.content}</div>
					<!-- <div id="snippet">{@html createSnippet(post.content, q)}</div> -->
				{/if}
			</div>
		{/each}
	{:else if q !== ''}
		<h2>No matches found. 😭</h2>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 0rem;
	}
	form {
		width: 100%;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 0.25rem;
		border: 1px solid #ccc;
	}
</style>
