<script lang="ts">
	import Gist from '$lib/components/Gist.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()
	const gist = $derived(data.post)
</script>

<SEO title={gist.title} imageUrl="" />

<section>
	<Gist {gist} />
</section>

<style>
	section {
		display: grid;
		place-items: center;
		height: 100%;
		margin-top: -5vh;
	}
</style>
