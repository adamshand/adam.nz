<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'

	import { pbUrl } from '$lib/utils'
	import snarkdown from 'snarkdown'
	import TagList from './TagList.svelte'

	// FIXME: type this properly, it already exists somewhere in `.sveltekit`
	// export let posts: Record<string, any>[]
	// export let showDetails = true

	let { posts, showDetails = true }: { posts: PostType[]; showDetails?: boolean } = $props()

	function randomHeight() {
		return Math.random() * (15 - 5) + 5
	}

	function randomColor() {
		return `#${Math.floor(Math.random() * 16777215).toString(16)}`
	}

	const hidePosts = [
		'/about',
		'/carnivore',
		'/carnivore/story',
		'/about/biographies',
		'/permaculture/kāpiti',
		'/permaculture/kapiti',
	]
</script>

<section>
	<!-- {#each posts as post} -->
	{#each posts as { collectionId, location, photos, id, title, tags, type, created }}
		{#if !hidePosts.includes(location ?? '')}
			{@const url = `${pbUrl}/api/files/${collectionId}/${id}/${photos ? photos[0] : ''}?thumb=320x0`}
			<div id="post">
				{#if photos?.length}
					<a href={location}> <img alt={title} id="feature" loading="lazy" src={url} {title} /></a>
				{:else}
					<div
						id="placeholder"
						style="height: {randomHeight() + 'rem'}; background-color: {randomColor()}; "
					></div>
				{/if}
				<div id="title">
					<a href={location}> {@html snarkdown(title ?? '')}</a>
				</div>
				{#if showDetails}
					{@const dayMonth = new Date(created).toLocaleDateString('en-NZ', {
						day: 'numeric',
						month: 'short',
					})}
					{@const year = new Date(created).getFullYear()}
					<div id="meta">
						<!-- FIXME: links /book etc don't exist -->
						Posted on {dayMonth}
						<a href="/{year}">{year}</a> in <a href="/posts/{type}">{type}</a>
						<TagList tags={tags ?? []} />
					</div>
				{/if}
			</div>
		{/if}
	{/each}
</section>

<style>
	* {
		margin: 0;
		padding: 0;
	}
	section {
		column-count: 3;
		column-gap: 0.5rem;
	}
	#post {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		break-inside: avoid;

		margin-bottom: 0.5rem;
		border: 1px solid var(--lightFaded);
		border-radius: var(--borderRadius);
	}
	#placeholder {
		margin: 5px;
		border-top-left-radius: var(--borderRadius);
		border-top-right-radius: var(--borderRadius);
	}
	#post img {
		padding: 5px;

		object-fit: cover;
		border-top-left-radius: var(--borderRadius);
		border-top-right-radius: var(--borderRadius);
	}
	#title {
		background-color: var(--darkContrast);
		padding: 0.3rem;
		text-align: center;
		font-size: 1rem;
		font-weight: 600;
	}
	#meta {
		margin: 0.5rem 0;
		font-size: 0.8rem;
		text-align: center;
	}
	#title a {
		text-decoration: none;
		/* font-weight: 400; */
	}
	a {
		/* text-decoration: none; */
		font-weight: 400;
	}
	@media (min-width: 1601px) {
		section {
			column-count: 4;
		}
	}
	@media (min-width: 1201px) and (max-width: 1600px) {
		section {
			column-count: 3;
		}
	}
	@media (min-width: 661px) and (max-width: 1200px) {
		section {
			column-count: 2;
		}
	}
	@media (max-width: 660px) {
		section {
			column-count: 1;
		}
	}
</style>
