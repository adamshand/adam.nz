<script lang="ts">
	import type { Snippet } from 'svelte'
	import { dev } from '$app/environment'

	import Footer from '$lib/components/Footer.svelte'
	import Header from '$lib/components/Header.svelte'

	import '$lib/reset.css'
	import '$lib/styles.css'
	// import OpenProps from 'open-props'

	let { children, data }: { children: Snippet; data } = $props()
	$inspect(data)
</script>

<svelte:head>
	{#if dev}
		<link href="https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/1F7E0.svg" rel="icon" />
	{:else}
		<link href="https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/color/svg/2605.svg" rel="icon" />
		{#if !data.user?.admin}
			<script
				async
				data-website-id="d5364df2-d71d-47b7-b39e-571c1ba77fda"
				src="https://umami.haume.nz/script.js"
			></script>
		{/if}
	{/if}
</svelte:head>

<main class:dev>
	<div>
		<Header />
		{@render children()}
	</div>
	<Footer />
</main>

<style>
	main {
		min-height: 100vh;
		min-height: 100dvh; /* better for mobile? */
		min-width: 380px;

		display: grid;
		grid-template-rows: 1fr auto;
		/* gap: 1rem; */
	}
	div {
		margin-inline: auto;
		max-width: var(--textWidth);
		width: calc(100vw - 2rem);
	}
	.dev {
		/* border-top: 2px dashed goldenrod; */
		border-left: 3px dashed crimson;
	}
</style>
