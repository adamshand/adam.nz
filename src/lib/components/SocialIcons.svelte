<script lang="ts">
	import { browser } from '$app/environment'
	import Openmoji from '$lib/components/Openmoji.svelte'
	import { getRandomElement, getRandomNumber, shuffle } from '$lib/utils'

	let { width = '2.5rem' } = $props()

	const natureEmojis = [
		'1FAB7',
		'1F338',
		'1F33B',
		'1F33C',
		'1F335',
		'1FABA',
		'1F332',
		'1FAB1',
		'1F41D',
		'1F997',
		'1F41E',
		'1F40C',
		'1F98B',
		'1F99A',
		'1F99C',
		'1F54A',
		'1F985',
		'1F414',
		'1F996',
		'1F40D',
		'1F422',
		'1F40A',
		'1F433',
		'1F419',
		'1F988',
		'1F42C',
		'1F9AD',
		'1F436',
		'1F43A',
		'1F98A',
		'1f99D',
		'1F431',
		'1F981',
		'1F42F',
		'1F984',
		'1F9AC',
		'1F404',
		'1F416',
		'1F40F',
		'1F410',
		'1F992',
		'1F418',
		'1F9A3',
		'1F407',
		'1F987',
		'1F43B',
		'1F9A8',
		'1F9AB',
	]

	let icons = $state([
		{ id: 'E046', link: 'https://www.linkedin.com/in/adamshand/', title: 'LinkedIn' },
		{ id: '2709', link: 'mailto:kiaora@adam.nz', title: 'Email' },
		{ id: 'E045', link: 'https://github.com/adamshand/', title: 'Github' },
		{ id: '260E', link: 'tel:+6421499772', title: 'Phone' },
		{ id: getRandomElement(natureEmojis), link: '', title: 'Random Animal or Flower' },
		// { id: 'E05A', link: 'https://mastodon.nz/@adamshand', title: 'Mastodon' },
		// { id: 'E05D', link: 'https://signal.me/#p/+6421499772', title: 'Signal' },
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
		margin-block: 1rem;
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
