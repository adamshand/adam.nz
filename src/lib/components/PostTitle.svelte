<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'

	import { page } from '$app/stores'
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

	// can't be $derived because it's a prop
	$effect(() => {
		if ($page.url.pathname != '/' && (post.type === 'archive' || post.type === 'manifesto')) {
			showAuthor = true
		}
	})
</script>

{#if isHeader}
	<h1 class="title">
		{@html snarkdown(post.title || '')}
		<span class:hideAuthor={!showAuthor} id="author" style="font-size: 0.7em; font-weight: 400;">
			by&nbsp;<a href="/search/by/{post.author}">{post.author}</a>
		</span>
		<!-- <span id="type">{post.type}</span> -->
	</h1>
{:else if isSubHeader}
	<!-- only used by ProjectCard -->
	<h3 class="title">
		<a href={post.location}> {@html snarkdown(post.title || '')}</a>
		<!-- <span id="author" class:hideAuthor={post.author != 'Adam Shand'}>by {post.author}</span> -->
	</h3>
{:else}
	<p class="title">
		<a href={post.location}> {@html snarkdown(post.title || '')}</a>
		<span class:hideAuthor={!showAuthor} id="author" style="font-size: 0.8em; font-weight: 350;">
			by&nbsp;<a href="/search/by/{post.author}">{post.author}</a>
		</span>
	</p>
{/if}

<style>
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
	/* h3 {
		margin: 0;
		padding: 0.5rem 0.25rem 1rem 0.25rem;
	} */
	p {
		margin: 0.85rem 0 0 0;
		line-height: 1.2;
		font-size: 1.05rem;
		font-weight: 300;
	}
	/* p a {
		text-decoration: none;
	} */
	/* #type {
		padding: 0.25em 0.6em 0.3em 0.4em;
		border-bottom-right-radius: 11px;
		border-top-right-radius: 11px;
		background-color: var(--accentFaded);
		color: var(--lightFaded);
		font-size: 0.8em;
		font-weight: 400;
	} */
</style>
