<script lang="ts">
	import type { PostType } from '$lib/types'

	import Breadcrumb from '$lib/components/Breadcrumb.svelte'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'

	let { data }: { data: { book: PostType } } = $props()
	const book = data?.book
</script>

<Breadcrumb />

<div class="book">
	<div class="cover">
		<img alt={book.title} src={getPhotoUrl(book)} />
		{#if book.aside}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="aside">{@html book.aside}</p>
		{/if}
	</div>
	<div class="info">
		<div>
			<h2>{book.title}</h2>
			<p class="author">
				By <a href="/search/by/{book.author}">{book.author}</a>
			</p>

			<div class="buttons">
				<a href={book.location}><button>Learn More</button></a>
			</div>
			<!-- eslint-disable-next-line svelte/no-at-html-tags -->
			<p class="blurb">{@html book.content}</p>
		</div>
	</div>
</div>

<style>
	:global(.aside div, .aside p) {
		/* required for .asside {padding-block} to not freak. */
		margin: 0;
		padding: 0;
	}
	.book {
		display: block;
		columns: 2;
		width: 100%;
		padding: 0.5rem;
		border: 1px solid var(--lightFaded);
		border-top-left-radius: var(--borderRadius);
		border-bottom-left-radius: var(--borderRadius);
	}
	.cover {
		break-inside: avoid;
		page-break-inside: avoid;
	}
	.cover img {
		width: 100%;
		border-top-left-radius: var(--borderRadius);
	}
	.aside {
		margin-block: 0.5rem;
		padding: 0.5rem 1rem;

		border: 1px solid var(--accentFaded);
		border-bottom-left-radius: var(--borderRadius);
		border-bottom-right-radius: var(--borderRadius);

		background-color: var(--accentFaded);
		color: var(--light);

		text-align: center;
		font-size: 0.9rem;
		font-weight: 200;
	}
	.info {
		break-inside: avoid;
		page-break-inside: avoid;
	}
	.author {
		font-size: 1rem;
		font-weight: 200;
	}
	.buttons {
		margin-block: 1rem;
		display: flex;
		justify-content: start;
	}
	a {
		text-decoration: none;
	}

	@media (max-width: 800px) {
		.book {
			columns: 1;
			border-bottom-left-radius: 0;
			border-top-right-radius: var(--borderRadius);
		}
		.cover {
			margin-bottom: 1.5rem;
		}
		.cover img {
			border-top-left-radius: var(--borderRadius);
			border-top-right-radius: var(--borderRadius);
		}
	}
</style>
