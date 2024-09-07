<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'
	import { page } from '$app/stores'
	import TagList from './TagList.svelte'

	let { showDetails = true, quote }: { showDetails?: boolean; quote: PostType } = $props()

	let quoteSize = $state(0)

	if ($page.params.quoteId) {
		if (quote.content.length < 50) {
			quoteSize = 4
		} else if (quote.content.length < 100) {
			quoteSize = 3.5
		} else if (quote.content.length < 200) {
			quoteSize = 3
		} else {
			quoteSize = 2.5
		}
	}

	let footerSize = $derived(quoteSize / 1.3)
</script>

<section class="quote" class:quoteSize style="--quoteSize: {quoteSize}vw;">
	{#if $page.params.quoteId}
		{@html quote.content}
	{:else}
		<a href="/quote/{quote.id}">
			{@html quote.content}
		</a>
	{/if}

	<footer class="quote" class:footerSize style="--footerSize: {footerSize}vw;">
		<b>&mdash;</b>&nbsp;<a class="author" href="/search/by/{quote.author}">{quote.author}</a>
		{#if showDetails}
			{#if quote.aside}
				<b>&laquo;</b><em>{@html quote.aside}</em><b>&raquo;</b>
			{/if}
			<TagList tags={quote.tags || []} />
		{/if}
	</footer>
</section>

<style>
	:global(footer.quote div, footer.quote p) {
		display: inline;
	}
	:global(footer.quote a) {
		color: var(--lightFaded);
		text-decoration: none;
	}
	:global(footer.quote a:hover) {
		color: var(--accentHover);
		text-decoration: none;
	}
	section {
		margin-block: 1rem;
		color: var(--lightFaded);
	}
	footer {
		margin: 0;
		padding: 0;
		margin-top: 0.3rem;
		margin-left: 1rem;
		font-size: 0.9rem;
	}
	.quoteSize {
		font-size: var(--quoteSize);
	}
	.footerSize {
		font-size: var(--footerSize);
	}
	a {
		color: var(--lightFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
	b {
		color: var(--accentFaded);
		font-weight: 600;
	}
	/* hanging-punctuation: first; /* only supported on Safari :-( */
	/* .hang {
		margin-left: -0.6rem;
	} */
</style>
