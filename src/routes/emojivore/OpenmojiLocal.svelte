<script lang="ts">
	let { id, title = '', width = '1.2em' }: { id: string; title?: string; width?: string } = $props()
	const src = `/emojivore/svg/${id.toUpperCase()}.svg`
</script>

<img alt="Openmoji {title}" class={id} {src} style="width: {width}; height: auto;" {title} />
