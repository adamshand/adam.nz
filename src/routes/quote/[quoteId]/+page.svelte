<script lang="ts">
	import Quote from '$lib/components/Quote.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { pbImagesId, pbUrl } from '$lib/utils'

	let { data } = $props()
	const quote = $derived(data?.post)
</script>

<SEO
	author={quote.author}
	copyright=""
	description={quote.aside}
	imageUrl={pbUrl +
		'/api/files/' +
		pbImagesId +
		'/7fistbep3n9u5f8/scrolls_S1Ve2OdEbu.jpg?thumb=512x0'}
	title="Quote by {quote.author}"
/>

<section>
	<Quote dynamicSize fullWidth {quote} />
</section>

<style>
	section {
		display: grid;
		place-items: center;
		height: 100%;
		/* margin-top: -5vh;  */
		/* padding-top: 1rem; */
	}
</style>
