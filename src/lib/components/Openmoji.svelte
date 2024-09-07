<script lang="ts">
	let {
		id,
		isColor = true,
		title = '',
		width = '1.2em',
	}: { id: string; isColor?: boolean; title?: string; width?: string } = $props()

	const src = `https://cdn.jsdelivr.net/gh/hfg-gmuend/openmoji/${
		isColor ? 'color' : 'black'
	}/svg/${id.toUpperCase()}.svg`
</script>

<!-- <img style="width: {width}; height: {width};" src="/openmoji/{id.toUpperCase()}.svg" alt="emoji" /> -->

<img alt="Emoji of {title}" class={id} {src} style="width: {width}; height: {width};" {title} />

<style>
	/* can use filter to flip the color of the emoji to white */
	/* img {
		filter: invert(70%);
	} */
</style>
