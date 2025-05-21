<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'

	import { page } from '$app/state'
	import snarkdown from 'snarkdown'

	let {
		post,
		isHeader = false,
		isSubHeader = false,
		showAuthor = false,
	}: {
		post: PostType
		isHeader?: boolean
		isSubHeader?: boolean
		showAuthor?: boolean
	} = $props()

	const isCarnivore = $derived(
		post.location?.startsWith('/carnivore') &&
			post.location != '/carnivore' &&
			post.location != '/carnivore/story',
	)

	$effect(() => {
		// FIXME: is there any need for showAuthor or does the below logic always work? Can exceptions be
		//        managed by changing showAuthor to forceShowAuthor and then using $derived instead of $effect?
		// can't be $derived because it's a prop
		if (page.url.pathname != '/' && (post.type === 'archive' || post.type === 'manifesto')) {
			showAuthor = true
		}
	})
</script>

{#if isHeader}
	{#if isCarnivore}
		<hgroup>
			<h1><a href="/carnivore">Short & Savory</a></h1>
			<p>A simple introduction to the Carnivore Diet</p>
		</hgroup>
		<h1>{@html snarkdown(post.title || '')}</h1>
	{:else}
		<h1>
			{@html snarkdown(post.title || '')}
			<span class:hideAuthor={!showAuthor} id="author" style="font-size: 0.7em; font-weight: 400;">
				by&nbsp;<a href="/search/by/{post.author}">{post.author}</a>
			</span>
		</h1>
	{/if}
{:else if isSubHeader}
	<!-- only used by ProjectCard.svelte -->
	<h3>
		<a href={post.location}> {@html snarkdown(post.title || '')}</a>
	</h3>
{:else}
	<p>
		<a href={post.location}> {@html snarkdown(post.title || '')}</a>
		<span class:hideAuthor={!showAuthor} id="author" style="font-size: 0.8em; font-weight: 350;">
			by&nbsp;<a href="/search/by/{post.author}">{post.author}</a>
		</span>
	</p>
{/if}

<style>
	hgroup {
		margin-bottom: 1rem;
		padding: 1rem;
		border: 1px solid var(--lightFaded);

		a {
			color: var(--accentFaded);
		}
		a:hover {
			color: var(--accent);
		}
	}

	a {
		color: var(--light);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
	#author,
	#author a {
		color: var(--lightFaded);
	}
	#author a:hover {
		color: var(--accentHover);
	}
	.hideAuthor {
		display: none;
	}

	p {
		margin: 0.85rem 0 0 0;
		line-height: 1.2;
		font-size: 1.05rem;
		font-weight: 300;
	}
</style>
