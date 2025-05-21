<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { TeeMillProductsType, emojivoreType } from '$lib/types'

	import { browser, dev } from '$app/environment'
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import Countdown from '$lib/components/Countdown.svelte'

	import Mockup from '../Mockup.svelte'
	import { carnivoreEmojis } from '../constants'

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

	const selectedEmojis = $derived(page.url.searchParams.get('emojis')?.split(',') || [])
	const products = $derived(
		data.products
			.filter((x) => allowedItems.includes(x.item_code))
			.sort((a, b) => a.name.localeCompare(b.name)),
	)
	const colours = $derived(
		Object.keys(products.find((x) => x.item_code === item_code)?.colours || {}),
	)
	const productImage = $derived(
		products.find((x) => x.item_code === item_code)?.colours[colour] || '',
	)

	$effect(() => {
		if (browser && form?.url) {
			const newWindow = window.open(form.url, '_blank')
			if (!newWindow) {
				window.location.href = form.url
			}
		}
	})

	function selectedEmojiDescriptions(array: string[]) {
		const descriptions = array.map(
			(se) => carnivoreEmojis.find((ce) => ce.code === se)?.description,
		)
		return `${descriptions[0]}, ${descriptions[1]} & ${descriptions[2]}`
	}
	$inspect('/emojivore/order/+page.svelte:', { colour, colours, item_code, productImage, sending })
</script>

<main>
	<!-- <Mockup emojis={selectedEmojis} image={productImage} width="3vw" /> -->
	<Mockup emojis={selectedEmojis} image={productImage} />

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
					<select
						bind:value={item_code}
						name="item_code"
						onchange={() => {
							colour = 'Black'
						}}
					>
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
				</div>

				<input name="title" type="hidden" value={selectedEmojiDescriptions(selectedEmojis)} />
				<input name="emojis" type="hidden" value={selectedEmojis.join(',')} />
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
