<script lang="ts">
	import { page } from '$app/state'
	import { goto } from '$app/navigation'
	import Gist from '$lib/components/Gist.svelte'
	import PostTitle from '$lib/components/PostTitle.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()
	let q = $derived(page.url.searchParams.get('q') || '')
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
	<form
		method="POST"
		onsubmit={(e) => {
			e.preventDefault()
			goto(`/search?q=${encodeURIComponent(q)}`)
		}}
	>
		<!-- svelte-ignore a11y_autofocus -->
		<input autofocus bind:value={q} name="q" placeholder="whatcha looking for?" />
	</form>

	{#if data.searching.length > 0}
		<h2>
			{data.searching.length} results for <em>{page.url.searchParams.get('q')}</em>
		</h2>
		{#each data.searching as post}
			<div>
				{#if post.type === 'gist'}
					<Gist gist={post} />
				{:else if post.type === 'quote'}
					<Quote quote={post} />
				{:else}
					<PostTitle isSubHeader {post} />
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					<div>{@html post.content}</div>
				{/if}
			</div>
		{/each}
	{:else if page.url.searchParams.get('q') !== ''}
		<h2>No matches for <em>{page.url.searchParams.get('q')}</em> found. 😢</h2>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
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
	em {
		background-color: var(--darkContrast);
		color: var(--light);
		padding: 0.1em 0.2em;
		border-radius: 0.25rem;
	}
</style>
