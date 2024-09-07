<script lang="ts">
	import EmojiRow from './EmojiRow.svelte'

	let {
		emojis = ['E0CB', '1F969', '1F9C2'],
		image,
		// width = '6vw',
	}: { emojis?: string[]; image: string } = $props()

	let isLoading = $state(true)

	let shirtWidth = $state(0)
	const width = $derived(`${shirtWidth * 0.075}px`)

	$effect(() => {
		isLoading = true
		// Makes spinner behave and browser back button from teemill store
		// Seems kinda hacky. Basically loads the image again (which might just be from browser cache),
		// and once that's done you know it's safe to set isLoading = false becuse the image is cached.
		const img = new Image()
		img.src = image + '?w=368'
		img.onload = () => (isLoading = false)
	})
</script>

<section bind:clientWidth={shirtWidth}>
	<img
		alt="Mockup"
		class:loading={isLoading}
		onload={() => {
			isLoading = false
		}}
		src={image + '?w=368'}
	/>
	{#if isLoading}
		<div class="spinner"></div>
	{:else}
		<div>
			<EmojiRow {emojis} {width} />
		</div>
	{/if}
</section>

<style>
	img {
		width: 100%;
		height: 100%;
	}
	section {
		position: relative;
		min-height: 300px;
		min-width: 100%;
	}
	div {
		position: absolute;
		top: 29%;
		left: 50%;
		transform: translate(-50%, 0);
		width: calc(0.35887412040656763 * 50%);
		height: auto;
		/* top: calc(0.23588410104011887 * 100%);
		left: calc(0.318608287724785 * 100%);
		height: calc(0.4550520059435364 * 50%);
		width: calc(0.35887412040656763 * 50%); */
	}
	.loading {
		display: none;
	}
	.spinner {
		border: 4px solid rgba(0, 0, 0, 0.1);
		width: 48px;
		height: 48px;
		border-radius: 50%;
		border-left-color: var(--accentHover);

		animation: spin 1s ease infinite;
	}
	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
