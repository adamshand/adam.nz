<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { TeeMillProductsType, emojivoreType } from '$lib/types'

	import { browser, dev } from '$app/environment'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Countdown from '$lib/components/Countdown.svelte'

	import Mockup from '../Mockup.svelte'
	import { foodEmojis } from '../foodEmojis'

	let {
		data,
		form = { url: '' },
	}: {
		data: { emojivore: emojivoreType[]; products: TeeMillProductsType[] }
		form: { url: string }
	} = $props()

	let sending = $state(false)
	let item_code = $state('RNA1')
	let colour = $state('Black')
	let allowedItems = $state([
		'RNA1',
		'RNA4',
		'RNA7',
		'RNA26',
		'RNB3',
		'RNB13',
		'RNB14',
		'RNB18',
		'RNB22',
		'RNB27',
		'RNC1',
	])
	const foodEmojiByCode = new Map(foodEmojis.map((emoji) => [emoji.code, emoji]))

	const selectedEmojis = $derived(
		(page.url.searchParams.get('emojis') ?? '').split(',').filter(Boolean),
	)
	$inspect(data.products)
	const products = $derived(
		data.products
			// .filter((x) => allowedItems.includes(x.item_code))
			.sort((a, b) => a.name.localeCompare(b.name)),
	)
	const selectedProduct = $derived(products.find((x) => x.item_code === item_code) || null)
	const colours = $derived(Object.keys(selectedProduct?.colours || {}))
	const productImage = $derived(selectedProduct?.colours[colour] || '')
	const designPlacement = $derived(selectedProduct?.design_placement || null)

	const placementYOverrides: Partial<Record<string, number>> = {
		// Example: RNA1: 0.12, adjust image up/down on garment.
	}
	const placementY = $derived.by(() => {
		const override = placementYOverrides[item_code]
		if (typeof override === 'number') return override
		const name = (selectedProduct?.name ?? '').toLowerCase()
		if (name.includes('tote') || name.includes('bag')) return 0.5
		return 0.15
	})

	const defaultLogoY = $derived.by(() => {
		const name = (selectedProduct?.name ?? '').toLowerCase()
		if (name.includes('tote') || name.includes('bag')) return 0.42
		return 0.35
	})
	let logoY = $state(0.35)
	let logoYTouched = $state(false)
	$effect(() => {
		// Reset user tweaks when switching products.
		item_code
		logoYTouched = false
		logoY = defaultLogoY
	})

	$effect(() => {
		if (products.length === 0) return
		if (!products.some((product) => product.item_code === item_code)) {
			item_code = products[0].item_code
		}
	})

	$effect(() => {
		if (colours.length === 0) return
		if (!colours.includes(colour)) {
			colour = colours[0]
		}
	})

	$effect(() => {
		if (browser && form?.url) {
			const newWindow = window.open(form.url, '_blank')
			if (!newWindow) {
				window.location.href = form.url
			}
		}
	})

	function selectedEmojiDescriptions(array: string[]) {
		const descriptions = array
			.map((se) => foodEmojiByCode.get(se)?.description)
			.filter((description): description is string => Boolean(description))
		if (descriptions.length === 0) return 'Mystery emojis'
		if (descriptions.length === 1) return descriptions[0]
		if (descriptions.length === 2) return `${descriptions[0]} & ${descriptions[1]}`
		return `${descriptions[0]}, ${descriptions[1]} & ${descriptions[2]}`
	}
	$inspect('/emojivore/order/+page.svelte:', { colour, colours, item_code, productImage, sending })
</script>

<main>
	<!-- <Mockup emojis={selectedEmojis} image={productImage} width="3vw" /> -->
	<Mockup
		emojis={selectedEmojis}
		image={productImage}
		placement={designPlacement}
		{placementY}
		{logoY}
	/>

	{#if sending}
		<div id="blurb">
			<h1>Emojivore Shirt 🎉 🎁</h1>
			{@html data.emojivore.find((x) => x.field === 'blurbOrder')?.html}

			<b>Ready in <Countdown countdown={15} /> seconds ...</b>
		</div>
	{:else}
		<div id="blurb">
			<h1>Emojivore Shirt 😎</h1>

			<p>{selectedEmojiDescriptions(selectedEmojis)}. Great combo!</p>

			{@html data.emojivore.find((x) => x.field === 'blurbGarment')?.html}

			<form
				method="POST"
				target="_blank"
				use:enhance={() => {
					sending = true
				}}
			>
				<div id="selects">
					<p class="fadedText" style="padding-inline: 1rem;">
						<i>Emoji placement and size on the mockup is approximate.</i>
					</p>
					<select bind:value={item_code} name="item_code">
						{#each products as product}
							<option value={product.item_code}>
								{product.name}
								{dev ? `(${product.item_code})` : ''}
							</option>
						{/each}
					</select>

					<select bind:value={colour} name="colour">
						{#each colours as colour}
							<option>{colour}</option>
						{/each}
					</select>

					<label class="slider">
						<span>Logo position (higher/lower)</span>
						<input
							bind:value={logoY}
							max={0.9}
							min={0}
							name="logoY"
							oninput={() => {
								logoYTouched = true
							}}
							step={0.01}
							type="range"
						/>
						<span class="sliderHint">Higher &lt;-&gt; Lower</span>
					</label>
					{#if logoYTouched}
						<button
							class="reset"
							onclick={(e) => {
								e.preventDefault()
								logoYTouched = false
								logoY = defaultLogoY
							}}
							type="button"
						>
							Reset logo position
						</button>
					{/if}
				</div>

				<input name="title" type="hidden" value={selectedEmojiDescriptions(selectedEmojis)} />
				<input name="emojis" type="hidden" value={selectedEmojis.join(',')} />
				<input
					name="placement_w"
					type="hidden"
					value={designPlacement?.w != null ? String(designPlacement.w) : ''}
				/>
				<input
					name="placement_h"
					type="hidden"
					value={designPlacement?.h != null ? String(designPlacement.h) : ''}
				/>
				<input
					name="blurb"
					type="hidden"
					value={data.emojivore.find((x) => x.field === 'blurbTeemill')?.html}
				/>
				<p class="fadedText" style="padding-inline: 2rem;">
					Having emoji regret? <br /><a href="/emojivore">Re-select your emoji.</a>
				</p>
				<button> Order</button>
			</form>
		</div>
	{/if}
</main>

<style>
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	form div {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;

		border: 2px dashed var(--accentFaded);
		padding: 0.5rem;
	}
	select {
		text-align: center;
	}
	.slider {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		margin-top: 0.25rem;
	}
	.sliderHint {
		text-align: center;
		font-size: 0.8rem;
		color: var(--lightFaded);
		letter-spacing: 0.08em;
	}
	#blurb {
		break-inside: avoid;
	}
	main {
		column-count: 2;
	}
	@media (max-width: 768px) {
		main {
			column-count: 1;
		}
	}
	form button {
		/* margin-inline: 1rem; */
		width: 100%;
	}
	form button.reset {
		width: auto;
		align-self: center;
		padding-inline: 1rem;
	}
	.fadedText,
	.fadedText a {
		text-align: center;
		margin-block: 0.5rem;
		font-size: 0.85rem;
		color: var(--lightFaded);
	}
	.fadedText a:hover {
		color: var(--light);
	}
</style>
