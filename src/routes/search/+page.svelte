<script lang="ts">
	import { enhance } from '$app/forms'
	/* eslint svelte/no-at-html-tags: 0 */
	import { page } from '$app/state'
	import PostTitle from '$lib/components/PostTitle.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import snarkdown from 'snarkdown'

	let { form } = $props()
	let searchFor = $state('')

	function createSnippet(body: string, keyword: string, snippetLength = 150) {
		// if (keyword) {
		// if keywords is '' then don't highlight
		// body = body.replace(/<[^>]+>/gi, ' ').replace(regex, '<mark>$&</mark>')
		// }
		let keywordPos = body.toLowerCase().indexOf(keyword.toLowerCase())
		// If the keyword isn't found, return an empty string
		if (keywordPos === -1) {
			return 'No matches found'
		}

		let startPos = Math.max(0, keywordPos - snippetLength)
		let endPos = Math.min(body.length, keywordPos + keyword.length + snippetLength)

		const regex = new RegExp(keyword, 'gi')
		const snippet = body
			.substring(startPos, endPos)
			.replace(/<[^>]+>/gi, ' ') // remove html tags
			.replace(/^\S+ /i, '') // remove first (probably incomplete) word
			// .replace(/ [A-z0-9]+$/i, '')
			.replace(regex, '<mark>$&</mark>')
		return snippet
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
	<form action="?/search" method="POST" use:enhance>
		<!-- svelte-ignore a11y_autofocus -->
		<input autofocus bind:value={searchFor} name="q" placeholder="search terms" />
	</form>
	{#if form?.success}
		<h2>{form.results.length} results for <em>{searchFor}</em></h2>
		{#each form.results as post}
			<div>
				{#if post.type === 'gist'}
					<a href="/id/{post.id}"
						>{@html `<pre><code>${snarkdown(post.title || '')}</code></pre>`}</a
					>
				{:else if post.type === 'quote'}
					<Quote quote={post} />
				{:else}
					<!-- <a href="/id/{post.id}">{@html snarkdown(post.title || '')}</a> -->
					<PostTitle isSubHeader {post} />
					<div id="snippet">{@html createSnippet(post.content, searchFor)}</div>
				{/if}
			</div>
		{/each}
		<!-- {:else if form.error}
		<p>{form.error}</p> -->
	{/if}
</section>

<style>
	/* * {
		border: 1px solid red;
	} */
	section {
		display: flex;
		flex-direction: column;
		/* justify-content: center;
		align-items: center; */

		gap: 1rem;
	}
	form {
		width: 80%;
	}
	input {
		width: 100%;
		padding: 0.5rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
	}
	#snippet {
		margin: 0.25rem 1rem 1rem 1rem;
		max-height: 60px;
		overflow: hidden;
	}
	:global(mark) {
		padding: 0.1rem 0.2rem;
		background-color: var(--darkContrast);
		color: var(--lightContrast);
		border-radius: var(--borderRadius);
	}
</style>
