<script lang="ts">
	import EmojiRow from './EmojiRow.svelte'

	let {
		emojis = ['E0CB', '1F969', '1F9C2'],
		image,
		placement = null,
		// width = '6vw',
	}: {
		emojis?: string[]
		image: string
		placement?: { x: number; y: number; w: number; h: number } | null
	} = $props()

	let isLoading = $state(true)

	let shirtWidth = $state(0)
	let imgWidth = $state(0)
	let imgHeight = $state(0)

	const withWidth = (src: string, w = 368) => {
		if (!src) return ''
		try {
			const url = new URL(src)
			url.searchParams.set('w', String(w))
			return url.toString()
		} catch {
			const joiner = src.includes('?') ? '&' : '?'
			return `${src}${joiner}w=${w}`
		}
	}

	const imgSrc = $derived(image ? withWidth(image, 368) : '')

	const overlayStyle = $derived.by(() => {
		if (!placement) {
			return 'left:50%;top:29%;transform:translate(-50%, 0);width:17.943706020328382%;height:auto;'
		}
		return `left:${placement.x * 100}%;top:${placement.y * 100}%;width:${placement.w * 100}%;height:${placement.h * 100}%;`
	})

	const emojiWidth = $derived.by(() => {
		if (!placement || imgWidth === 0 || imgHeight === 0) {
			return `${shirtWidth * 0.075}px`
		}
		const boxW = placement.w * imgWidth
		const boxH = placement.h * imgHeight
		const count = Math.max(1, emojis.length)
		// keep a bit of breathing room so it doesn't touch edges
		const byWidth = boxW / (count + 0.6)
		const byHeight = boxH * 0.85
		const px = Math.max(12, Math.floor(Math.min(byWidth, byHeight)))
		return `${px}px`
	})

	$effect(() => {
		if (!imgSrc) {
			isLoading = false
			return
		}
		isLoading = true
		// Makes spinner behave and browser back button from teemill store
		// Seems kinda hacky. Basically loads the image again (which might just be from browser cache),
		// and once that's done you know it's safe to set isLoading = false becuse the image is cached.
		const img = new Image()
		img.src = imgSrc
		img.onload = () => (isLoading = false)
		img.onerror = () => (isLoading = false)
	})
</script>

<section bind:clientWidth={shirtWidth}>
	<img
		alt="Mockup"
		class:loading={isLoading}
		bind:clientHeight={imgHeight}
		bind:clientWidth={imgWidth}
		onload={() => {
			isLoading = false
		}}
		onerror={() => {
			isLoading = false
		}}
		src={imgSrc}
	/>
	{#if isLoading}
		<div class="spinner"></div>
	{:else}
		<div class="overlay" style={overlayStyle}>
			<EmojiRow {emojis} width={emojiWidth} />
		</div>
	{/if}
</section>

<style>
	img {
		width: 100%;
		height: auto;
		display: block;
	}
	section {
		position: relative;
		min-height: 300px;
		min-width: 100%;
	}
	img.loading {
		opacity: 0;
	}

	.overlay {
		position: absolute;
		display: flex;
		align-items: center;
		justify-content: center;
		/* positioned via inline style when placement is available */
		/* top: calc(0.23588410104011887 * 100%);
		left: calc(0.318608287724785 * 100%);
		height: calc(0.4550520059435364 * 50%);
		width: calc(0.35887412040656763 * 50%); */
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
