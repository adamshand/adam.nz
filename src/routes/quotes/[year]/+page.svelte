<script lang="ts">
	import type { PostType } from '$lib/types'

	import { goto } from '$app/navigation'
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { pbImagesId, pbUrl } from '$lib/utils'

	let { data }: { data: { quotes: PostType[]; year: string } } = $props()

	let year = $state(data.year.toString())
	const currentYear = new Date().getFullYear()
	const years = Array.from({ length: currentYear - 2001 + 1 }, (_, i) => String(currentYear - i))

	const imageUrl =
		pbUrl + '/api/files/' + pbImagesId + '/7fistbep3n9u5f8/scrolls_S1Ve2OdEbu.jpg?thumb=512x0'
	const location = '/quotes'
</script>

<SEO {imageUrl} {location} title={`Quotes from ${year}`} />

<h1>Quotes</h1>
<form>
	Showing quotes added in
	<select bind:value={year} onchange={() => goto('/quotes/' + year)}>
		{#each years as y}
			<option value={y}>{y}</option>
		{/each}
	</select>
	{#if year === '2001'}
		and earlier.
	{/if}
</form>

<aside>
	<div>
		<p>
			Back in the mid-90s, I wanted to learn how to write HTML. I had a stash of funny, mostly geeky
			quotes and so I used them as the content for my first web page.
		</p>
		<p>
			Somehow this page never got lost or abandoned, and has faithfully followed me from website to
			website over the years. As my interests have shifted so too have the quotes which inspire,
			provoke, and amuse me.
		</p>
	</div>
</aside>

{#each data.quotes as quote}
	<div>
		<Quote {quote} />
	</div>
{/each}

<style>
	select {
		margin-bottom: 1rem;
		padding: 0.15rem;
	}
	div {
		margin-block: 1rem;
	}
</style>
