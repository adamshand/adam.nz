<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'
	import { page } from '$app/state'
	let { gist }: { gist: PostType } = $props()

	function stripLeadingTrailingHTML(html: string) {
		return html.replace(/^<[^>]>/, '').replace(/<\/[^>]>$/g, '')
	}
	// Useful because otherwise css formatting is fucky with @html
	const description = $derived(stripLeadingTrailingHTML(gist.content ?? ''))
</script>

<section>
	<div class="gist">
		{#if page.params.gistId}
			{gist.title}
		{:else}
			<a href="/gist/{gist.id}">{gist.title}</a>
		{/if}
	</div>
	<div class="desc">
		{@html description}
	</div>
</section>

<style>
	:root {
		--textSize: 1rem;
		--gistPadding: 0.5rem;
	}
	section {
		max-width: var(--textWidth);
		width: calc(100vw - 2rem);
		margin-bottom: 1rem;
		border: 1px solid var(--darkContrast);
		border-bottom-left-radius: var(--borderRadius);
		border-bottom-right-radius: var(--borderRadius);
	}
	.gist {
		/* this requires a block element */
		padding-left: 2.5em;
		text-indent: -2em;

		padding-block: var(--gistPadding);
		background-color: var(--darkContrast);
		color: var(--lightContrast);

		font-family: 'Recursive'; /* required or resets to monospace */
		--mono: 1;
		--casl: 0;
		font-weight: 300;

		/* break long words to avoid overflowing */
		hyphens: none;
		overflow-wrap: anywhere;

		/* overflow-wrap: break-word; */
		/* white-space: nowrap; */

		/* overflow: auto; */
		/* overflow-x: scroll; */
		/* scrollbar-width: none; /* Hide scrollbar for Firefox */
		/*-ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
		/*overscroll-behavior-x: none; /*stops browser history activating from swipe at end of carousel */
	}
	.gist::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
	}
	.desc {
		padding: var(--gistPadding);
	}
	a {
		text-decoration: none;
	}
</style>
