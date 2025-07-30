<script lang="ts">
	import { browser } from '$app/environment'
	import Openmoji from '$lib/components/Openmoji.svelte'
	import { getRandomNumber, shuffle } from '$lib/utils'
	import { getRandomNatureEmoji } from '.'

	let { width = '2.5rem' } = $props()

	let icons = $state([
		{ id: 'E046', link: 'https://www.linkedin.com/in/adamshand/', title: 'LinkedIn' },
		{ id: '2709', link: 'mailto:kiaora@adam.nz', title: 'Email' },
		{ id: 'E045', link: 'https://github.com/adamshand/', title: 'Github' },
		{ id: '260E', link: 'tel:+6421499772', title: 'Phone' },
		{ id: getRandomNatureEmoji(), link: '', title: 'Random Animal or Flower' },
		{ id: 'E05A', link: 'https://mastodon.nz/@adamshand', title: 'Mastodon' },
		{ id: 'E05D', link: 'https://signal.me/#p/+6421499772', title: 'Signal' },
	])
	shuffle(icons)
</script>

<section>
	{#if browser}
		{#each icons as icon}
			{#if icon.link}
				{@const rotation = getRandomNumber(-19, 19)}
				{@const scale = getRandomNumber(1.1, 1.25)}
				<a style={`--rotate: ${rotation}deg; --scale: ${scale}`} href={icon.link} rel="me">
					<Openmoji id={icon.id} title={icon.title} {width} />
				</a>
			{:else}
				<Openmoji id={icon.id} title={icon.title} {width} />
			{/if}
		{/each}
	{/if}
</section>

<style>
	section {
		display: flex;
		margin-block: 0rem 1rem;
	}
	a,
	a:hover {
		text-decoration: none;
		transition: transform 0.5s ease;
	}
	a:hover {
		transform: rotate(var(--rotate)) scale(var(--scale));
	}
</style>
