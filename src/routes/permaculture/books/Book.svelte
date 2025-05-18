<script lang="ts">
	import type { PostType } from '$lib/types'

	import { decodeHtmlEntities, formatDate, pbUrl } from '$lib/utils'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'

	let { book, sortBy }: { book: PostType; sortBy: string } = $props()
	const title = $derived(decodeHtmlEntities(book.title ?? ''))
</script>

<div class="book">
	<a href="/permaculture/books/{book.id}">
		<img alt={title} src={getPhotoUrl(book)} {title} />
	</a>
	<h2 class:no-details={!book.aside}>
		<a href="/permaculture/books/{book.id}">{title}</a>
	</h2>
	{#if sortBy === 'author' && book.author}
		<div class="author">
			<a href="/search/by/{book.author}">{book.author}</a>
		</div>
	{:else if sortBy === 'actualCreated' && book.actualCreated}
		<div class="published">
			{formatDate(book.actualCreated)}
		</div>
	{:else if book.aside}
		<div class="aside">
			<div class="aside">
				<!-- eslint-disable-next-line svelte/no-at-html-tags -->
				{@html book.aside}
			</div>
		</div>
	{/if}
</div>

<style>
	.book {
		display: flex;
		flex-direction: column;
		margin-bottom: 1rem;
		border: 1px solid var(--lightFaded);
		border-bottom-left-radius: var(--borderRadius);
		border-bottom-right-radius: var(--borderRadius);
		padding: 0.3rem;
		break-inside: avoid;
	}
	.book img {
		width: 100%;
		opacity: 0.85;
	}
	.book img:hover {
		opacity: 1;
	}
	.book h2 {
		display: block;
		width: 100%;
		margin-block: 0.5rem;
		padding: 0.5rem;
		background-color: var(--darkContrast);
		font-size: 1rem;
		text-align: center;
	}
	.book h2.no-details {
		margin-bottom: 0;

		border-bottom-left-radius: var(--borderRadius);
		border-bottom-right-radius: var(--borderRadius);
	}
	h2 a,
	h2 a:visited,
	h2 a:link {
		color: var(--accent);
		text-decoration: none;
	}
	h2 a:hover {
		color: var(--accentHover);
	}
	:global(.aside div, .aside p) {
		/* required to stop @html book.aside added extra vertical spacing */
		margin: 0;
		padding: 0;
	}
	.aside,
	.author,
	.published {
		padding: 0.3rem;
		color: var(--lightFaded);
		font-size: 0.85rem;
		font-weight: 200;
		text-align: center;
	}
	.author a,
	.author a:visited,
	.author a:link {
		color: var(--lightFaded);
		text-decoration: none;
	}
	.author a:hover {
		color: var(--accentHover);
	}
</style>
