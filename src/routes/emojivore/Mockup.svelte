<script lang="ts">
	import EmojiRow from './EmojiRow.svelte'
	import OpenmojiLocal from './OpenmojiLocal.svelte'

	let {
		emojis = ['E0CB', '1F969', '1F9C2'],
		image,
		placement = null,
		placementY = 0.15,
		logoY = 0.35,
		// width = '6vw',
	}: {
		emojis?: string[]
		image: string
		placement?: { x: number; y: number; w: number; h: number } | null
		placementY?: number
		logoY?: number
	} = $props()

	let isLoading = $state(true)

	let shirtWidth = $state(0)
	let imgWidth = $state(0)
	let imgHeight = $state(0)

	const clamp01 = (n: number) => Math.min(1, Math.max(0, n))

	// Mirrors the server-side image generation in `src/routes/emojivore/order/+page.server.ts`.
	// We keep the design width fixed, and adjust the design height to match the product's
	// `design_placement` aspect ratio so Teemill scales/places the PNG consistently.
	const designWidth = 3000
	const emojiSize = 512
	const designHeight = $derived.by(() => {
		if (!placement) return emojiSize * 2
		if (placement.w <= 0 || placement.h <= 0) return emojiSize * 2
		const ratio = placement.h / placement.w
		const raw = Math.round(designWidth * ratio)
		return Math.min(7000, Math.max(emojiSize + 64, raw))
	})
	const sidePad = emojiSize + 120
	const topPadFallback = emojiSize - 150

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

	const boxPx = $derived.by(() => {
		if (!placement || imgWidth === 0 || imgHeight === 0) return null
		return {
			w: placement.w * imgWidth,
			h: placement.h * imgHeight,
		}
	})

	const designFit = $derived.by(() => {
		if (!boxPx) return null
		let w = boxPx.w
		let h = (w * designHeight) / designWidth
		if (h > boxPx.h) {
			h = boxPx.h
			w = (h * designWidth) / designHeight
		}
		const left = (boxPx.w - w) / 2
		const top = (boxPx.h - h) * clamp01(placementY)
		return { h, left, top, w }
	})

	const designStyle = $derived.by(() => {
		if (!designFit) return ''
		return `left:${designFit.left}px;top:${designFit.top}px;width:${designFit.w}px;height:${designFit.h}px;`
	})

	const emojiPx = $derived.by(() => {
		if (!designFit) return Math.max(12, Math.floor(shirtWidth * 0.075))
		return Math.max(12, Math.floor((designFit.w * emojiSize) / designWidth))
	})
	const emojiWidth = $derived.by(() => `${emojiPx}px`)

	const logoTopCanvasPx = $derived.by(() => {
		const raw = typeof logoY === 'number' ? logoY : Number(logoY)
		const fallback = topPadFallback
		if (!Number.isFinite(raw)) return fallback
		const maxTop = designHeight - emojiSize
		const top = Math.round(raw * designHeight)
		return Math.min(maxTop, Math.max(0, top))
	})
	const emojiTopPx = $derived.by(() => {
		if (!designFit) return 0
		return Math.round((designFit.h * logoTopCanvasPx) / designHeight)
	})

	const emojiLeftPx = $derived.by(() => {
		if (!designFit) return [] as number[]
		const scale = designFit.w / designWidth
		const left = sidePad * scale
		const center = (designWidth / 2 - emojiSize / 2) * scale
		const right = (designWidth - sidePad - emojiSize) * scale
		if (emojis.length <= 1) return [center]
		if (emojis.length === 2) return [left, right]
		return [left, center, right]
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

<section class:loading={isLoading} bind:clientWidth={shirtWidth}>
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
			{#if designFit}
				<div class="design" style={designStyle}>
					{#each emojis.slice(0, 3) as emoji, i (emoji)}
						<div class="emoji" style={`left:${emojiLeftPx[i] ?? 0}px;top:${emojiTopPx}px;`}>
							<OpenmojiLocal id={emoji} width={emojiWidth} />
						</div>
					{/each}
				</div>
			{:else}
				<EmojiRow {emojis} width={emojiWidth} />
			{/if}
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
		min-width: 100%;
	}
	section.loading {
		min-height: 300px;
	}
	img.loading {
		opacity: 0;
	}

	.overlay {
		position: absolute;
		display: flex;
		justify-content: center;
		/* positioned via inline style when placement is available */
		box-sizing: border-box;
		/* top: calc(0.23588410104011887 * 100%);
		left: calc(0.318608287724785 * 100%);
		height: calc(0.4550520059435364 * 50%);
		width: calc(0.35887412040656763 * 50%); */
	}
	.design {
		position: absolute;
	}
	.emoji {
		position: absolute;
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
