<script lang="ts">
	let { id, title = '', width = '1.2em' }: { id: string; title?: string; width?: string } = $props()
	const src = $derived(`/emojivore/svg/${id.toUpperCase()}.svg`)
	const alt = $derived(title ? `Openmoji ${title}` : 'Openmoji')
</script>

<img {alt} class={id} {src} style:height="auto" style:width={width} title={title} />
