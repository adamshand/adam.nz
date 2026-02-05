<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { emojivoreType } from '$lib/types'
	import { goto } from '$app/navigation'
	import { page } from '$app/state'
	import { shuffle } from '$lib/utils'

	import EmojiRow from './EmojiRow.svelte'
	import OpenmojiLocal from './OpenmojiLocal.svelte'
	import type { FoodEmoji } from './foodEmojis'
	import { foodEmojis } from './foodEmojis'

	let { data } = $props()
	let selectedEmojis = $state(['E0CB', '1F969', '1F9C2'])
	type DietFilter = 'all' | 'carnivore' | 'paleo' | 'vegetarian' | 'vegan'
	let dietFilter = $state<DietFilter>('all')
	let emojiOptions = $state([] as FoodEmoji[])

	const dietOptions = [
		{ label: 'All food & drink', value: 'all' },
		{ label: 'Carnivore', value: 'carnivore' },
		{ label: 'Paleo', value: 'paleo' },
		{ label: 'Vegetarian', value: 'vegetarian' },
		{ label: 'Vegan', value: 'vegan' },
	] as const

	const hasAnyTag = (emoji: FoodEmoji, keywords: Set<string>) =>
		emoji.tags.some((tag) => keywords.has(tag))

	const meatKeywords = new Set([
		'bacon',
		'beef',
		'burger',
		'chicken',
		'chop',
		'cut of meat',
		'drumstick',
		'ham',
		'hamburger',
		'hot dog',
		'hotdog',
		'lambchop',
		'meat',
		'meat on bone',
		'pepperoni',
		'porkchop',
		'poultry',
		'sausage',
		'steak',
		'turkey',
	])
	const seafoodKeywords = new Set(['fish', 'shrimp', 'prawn', 'oyster', 'sushi'])
	const dairyKeywords = new Set([
		'butter',
		'cheese',
		'cream',
		'ice cream',
		'icecream',
		'milk',
		'fondue',
	])
	const eggKeywords = new Set(['egg'])
	const honeyKeywords = new Set(['honey'])
	const coffeeKeywords = new Set(['coffee', 'espresso', 'latte', 'macchiato'])
	const legumeKeywords = new Set(['beans', 'bean', 'pea', 'peas', 'legume', 'lentil', 'lentils', 'edamame', 'chickpea', 'peanut'])
	const nutKeywords = new Set(['nut', 'nuts', 'peanut', 'almond', 'hazelnut', 'chestnut'])
	const fruitKeywords = new Set(['fruit'])
	const vegetableKeywords = new Set(['vegetable', 'veggie'])
	const grainKeywords = new Set([
		'bread',
		'bagel',
		'baguette',
		'biscuit',
		'bun',
		'cookie',
		'croissant',
		'cereal',
		'corn',
		'dumpling',
		'flatbread',
		'noodle',
		'pancake',
		'pasta',
		'pretzel',
		'rice',
		'ramen',
		'sandwich',
		'spaghetti',
		'taco',
		'tortilla',
		'waffle',
		'wheat',
		'grain',
	])
	const sweetKeywords = new Set(['candy', 'dessert', 'sweet', 'chocolate', 'cake', 'cookie', 'donut', 'doughnut'])

	const matchesDiet = (emoji: FoodEmoji, diet: DietFilter) => {
		if (diet === 'all') return true
		if (emoji.subgroup === 'dishware') return false

		const isMeat = hasAnyTag(emoji, meatKeywords)
		const isSeafood = hasAnyTag(emoji, seafoodKeywords)
		const isDairy = hasAnyTag(emoji, dairyKeywords)
		const isEgg = hasAnyTag(emoji, eggKeywords)
		const isHoney = hasAnyTag(emoji, honeyKeywords)
		const isCoffee = hasAnyTag(emoji, coffeeKeywords)
		const isLegume = hasAnyTag(emoji, legumeKeywords)
		const isNut = hasAnyTag(emoji, nutKeywords)
		const isGrain = hasAnyTag(emoji, grainKeywords)
		const isSweet = emoji.subgroup === 'food-sweet' || hasAnyTag(emoji, sweetKeywords)
		const isFruit = emoji.subgroup === 'food-fruit' || hasAnyTag(emoji, fruitKeywords)
		const isVegetable =
			emoji.subgroup === 'food-vegetable' || hasAnyTag(emoji, vegetableKeywords)

		if (diet === 'carnivore') {
			return isMeat || isSeafood || isDairy || isEgg || isCoffee
		}
		if (diet === 'vegetarian') {
			return !(isMeat || isSeafood)
		}
		if (diet === 'vegan') {
			return !(isMeat || isSeafood || isDairy || isEgg || isHoney)
		}

		return (
			(isMeat ||
				isSeafood ||
				isEgg ||
				isNut ||
				isFruit ||
				isVegetable ||
				isCoffee ||
				emoji.subgroup === 'drink') &&
			!isDairy &&
			!isLegume &&
			!isGrain &&
			!isSweet
		)
	}

	$effect(() => {
		const next = foodEmojis.filter((emoji) => matchesDiet(emoji, dietFilter))
		shuffle(next)
		emojiOptions = next
	})

	function selectEmoji(emoji: string) {
		if (selectedEmojis.includes(emoji)) {
			return
		}
		if (selectedEmojis.length < 3) {
			selectedEmojis = [...selectedEmojis, emoji]
		} else {
			selectedEmojis = [...selectedEmojis.slice(1), emoji]
		}
	}

	const errorMessage = $derived(page.url.searchParams.get('error') || '')
	const orderUrl = $derived(`/emojivore/order?emojis=${selectedEmojis.join(',')}`)
	const isDisabled = (emoji: string) => selectedEmojis.includes(emoji)

	$inspect(data)
</script>

<main>
	<h1>Emojivore Shirt 🔥</h1>
	{#if errorMessage === 'invalidEmoji'}
		<div class="error">
			<span class="icon">⚠️</span>
			<span>
				Oh noes, something went wrong. Please try again and hopefully the computers will behave. If
				not, <a href="mailto:kiaora@adam.nz?subject=Emojivore Garment and Colour Page Go Boom 💣 😭"
					>unleash the nerds</a
				>!
			</span>
		</div>
	{/if}

	<div id="blurb">
		{#if data?.emojivore}
			{@const blurb = data.emojivore.find((x: emojivoreType) => x.field === 'blurbEmojiSelector')}
			{@html blurb?.html}
		{/if}
	</div>

	<div id="grid">
		<div id="selected">
			<EmojiRow emojis={selectedEmojis} width="5rem" />
		</div>

		<h2>Select Three Emojis</h2>

		<div class="filters">
			<label>
				<span>Filter</span>
				<select bind:value={dietFilter}>
					{#each dietOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>
			</label>
			<span class="count">{emojiOptions.length} emojis</span>
		</div>

		<div class="emojis">
			{#each emojiOptions as emoji (emoji.code)}
				<button
					class="emoji"
					class:disabled={isDisabled(emoji.code)}
					disabled={isDisabled(emoji.code)}
					onclick={() => selectEmoji(emoji.code)}
					type="button"
				>
					<OpenmojiLocal id={emoji.code} title={emoji.description} width="2.5rem" />
				</button>
			{/each}
		</div>

		<div class="fadedText" style="margin-inline: 2rem;">
			Emoji provided by <a href="https://openmoji.org/about/" target="_blank">OpenMoji</a>. An open
			source, community project by students and professors at
			<a href="http://www.hfg-gmuend.de/" target="_blank">HfG Schwäbisch Gmünd</a>.
		</div>
	</div>

	<button onclick={() => goto(orderUrl)}>Choose Garment & Colour</button>
	<!-- <div id="order"><a href={orderUrl} role="button">Choose Garment & Colour</a></div> -->

	<div class="fadedText" style="margin: -0.5rem 1.5rem; font-style: italic;">
		All shirts are certified organic cotton and printed in an English factory powered by renewable
		energy.
	</div>
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	#blurb {
		column-count: 2;
		text-align: justify;
	}
	#grid {
		margin: 5px;
		/* padding: 1rem 0.5rem; */
		outline: 2px solid var(--darkContrast);
		text-align: center;
	}
	#selected {
		display: flex;
		justify-content: center;
		gap: 0.3rem;
		margin-bottom: 1rem;
		padding: 0.5rem;
		background-color: var(--darkContrast);
	}
	#grid button {
		border-radius: 50%;
		margin: 0.4rem;
	}
	.filters {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
		margin-bottom: 0.5rem;
	}
	.filters label {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.filters select {
		min-width: 180px;
		text-align: center;
	}
	.filters .count {
		font-size: 0.85rem;
		color: var(--lightFaded);
	}
	#grid button.disabled {
		cursor: not-allowed;
		outline: 2px solid var(--accentHover);
	}
	#grid button.disabled:hover {
		background-color: var(--darkContrast);
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
	.error {
		padding: 0.5rem;
		border: 2px dashed crimson;
		display: flex;
		align-items: center;
		gap: 1rem;
	}
	.error .icon {
		padding-inline: 1rem;
		font-size: 2rem;
	}
	@media (max-width: 768px) {
		#blurb {
			columns: 1;
			text-align: left;
		}
	}
</style>
