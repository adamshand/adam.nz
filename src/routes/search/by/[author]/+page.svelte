<script lang="ts">
	import type { PostType } from '$lib/types'

	import { page } from '$app/stores'
	import PostsIndex from '$lib/components/PostsIndex.svelte'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { formatDate } from '$lib/utils'

	let { data }: { data: { byAuthor: PostType[] } } = $props()

	// $: books = data.byAuthor.filter((x) => x.format === 'book')
	// $: quotes = data.byAuthor.filter((x) => x.format === 'quote')

	const books = data.byAuthor.filter((x) => x.format === 'book')
	const quotes = data.byAuthor.filter((x) => x.format === 'quote')

	const author = $page.url.pathname.replace('/search/by/', '').replace('%20', ' ') || undefined
</script>

<SEO
	{author}
	copyright=""
	description=""
	imageUrl=""
	location={$page.url.pathname}
	title="By {author}"
/>

<h1>Searching for {$page.params.author}</h1>

<h2>Posts</h2>
<PostsIndex author={$page.params.author} showType={false} />

<h2>Books</h2>
{#if books.length > 0}
	{#each books as book}
		<div>
			<a href="/id/{book.id}">{book.title}</a> <span>by {book.author}</span>
		</div>
		<div><span>Written on {formatDate(book.actualCreated || '')}</span></div>
	{/each}
{:else}
	<p>No books found by {$page.params.author}</p>
{/if}

<h2>Quotes</h2>
{#if quotes.length > 0}
	{#each quotes as quote}
		<Quote {quote} />
	{/each}
{:else}
	<p>No quotes found by {$page.params.author}</p>
{/if}

<style>
	h2 {
		margin-top: 1rem;
	}
	span {
		color: var(--lightFaded);
		font-size: 0.85rem;
	}
	a {
		text-decoration: none;
	}
</style>
