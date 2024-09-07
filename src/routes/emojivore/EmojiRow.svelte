<script lang="ts">
	import OpenmojiLocal from './OpenmojiLocal.svelte'

	let {
		emojis = ['E0CB', '1F969', '1F9C2'],
		width = '6vw',
	}: { emojis?: string[]; width?: string } = $props()
</script>

<section>
	{#if emojis.length > 0}
		{#each emojis as emoji (emoji)}
			<OpenmojiLocal id={emoji} {width} />
		{/each}
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		justify-content: center;
	}
</style>
