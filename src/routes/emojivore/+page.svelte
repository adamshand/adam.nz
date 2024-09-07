<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import { browser } from '$app/environment'
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import { shuffled } from '$lib/utils'

	import EmojiRow from './EmojiRow.svelte'
	import OpenmojiLocal from './OpenmojiLocal.svelte'
	import { carnivoreEmojis } from './constants'

	let { data } = $props()
	let divToPng: HTMLDivElement
	let selectedEmojis = $state(['E0CB', '1F969', '1F9C2'])

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

	const errorMessage = $derived($page.url.searchParams.get('error') || '')
	const orderUrl = $derived(`/emojivore/order?emojis=${selectedEmojis.join(',')}`)
	const isDisabled = $derived((emoji: string) => selectedEmojis.includes(emoji))
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
			{@const blurb = data.emojivore.find((x) => x.field === 'blurbEmojiSelector')}
			{@html blurb?.html}
		{/if}
	</div>

	<div id="grid">
		<div bind:this={divToPng} id="selected">
			<EmojiRow emojis={selectedEmojis} width="5rem" />
		</div>

		<h2>Select Three Emojis</h2>

		<div class="emojis">
			{#if browser}
				{#each shuffled(carnivoreEmojis) as emoji}
					<button
						class="emoji"
						class:disabled={isDisabled(emoji.code)}
						onclick={() => selectEmoji(emoji.code)}
					>
						<OpenmojiLocal id={emoji.code} title={emoji.description} width="2.5rem" />
					</button>
				{/each}
			{/if}
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
