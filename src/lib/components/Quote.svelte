<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'
	import { page } from '$app/state'
	import TagList from './TagList.svelte'
	import { browser } from '$app/environment'

	let {
		dynamicSize = false,
		fullWidth = false,
		showDetails = true,
		quote,
	}: {
		dynamicSize?: boolean
		fullWidth?: boolean
		showDetails?: boolean
		quote: PostType
	} = $props()

	const quoteSize = $derived.by(() => {
		if (browser && dynamicSize) {
			const quoteLength =
				(quote.aside?.length ?? 0) +
				(quote.author?.length ?? 0) +
				quote.content.length +
				(quote.tags?.join('').length ?? 0)
			const areaPerChar = window.innerWidth * 0.9 * (window.innerHeight * 0.9)
			return Math.round(Math.sqrt(areaPerChar / quoteLength) * 0.9)
		} else {
			return 22
		}
	})
</script>

<section class="quote" class:fullWidth style="font-size: clamp(18px, {quoteSize}px, 70px);">
	{#if page.params.quoteId}
		{@html quote.content}
	{:else}
		<a href="/quote/{quote.id}">
			{@html quote.content}
		</a>
	{/if}

	<footer
		class="quote"
		style="font-size: clamp(calc(18px * .8), {quoteSize * 0.8}px, calc(70px * .65))"
	>
		<b>&mdash;</b>&nbsp;<a class="author" href="/search/by/{quote.author}">{@html quote.author}</a>
		{#if showDetails}
			{#if quote.aside}
				<b>&laquo;</b><em>{@html quote.aside}</em><b>&raquo;</b>
			{/if}
			<TagList tags={quote.tags || []} />
		{/if}
	</footer>
</section>

<style>
	.quote :global {
		footer {
			div,
			p {
				display: inline;
			}
			a {
				color: var(--lightFaded);
				text-decoration: none;
			}
			a:hover {
				color: var(--accentHover);
				text-decoration: none;
			}
		}
	}

	section {
		margin-block: 1rem;
		color: var(--lightFaded);
	}
	.fullWidth {
		width: 84vw;
		margin-left: calc(-42vw + 50%);
		margin-right: calc(-42vw + 50%);
	}
	footer {
		margin: 0;
		padding: 0;
		margin-top: 0.3rem;
		margin-left: 1rem;
		font-size: 0.9rem;
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
</style>
