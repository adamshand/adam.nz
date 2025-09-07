<script lang="ts">
	import type { PostType } from '$lib/types'
	import groupBy from 'just-group-by'
	import PostTitle from '$lib/components/PostTitle.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { siteName } from '$lib/utils'

	let { data }: { data: { posts: PostType[]; types: string[] } } = $props()

	const filteredPosts = data.posts
		.filter((post: PostType) => post.status === 'public')
		.filter((post: PostType) => post.category !== 'meta')
	const postsGroupedByType = groupBy(filteredPosts, (post: PostType) => post.type)
	const postTypes = [...Object.keys(postsGroupedByType), 'gist', 'quote'].sort()
</script>

<SEO imageUrl="" location={`/sitemap`} title="Sitemap for {siteName}" />

<h1>Sitemap</h1>

<p>
	{#each postTypes as type, i}
		<a href={`#${type}`}>{type}s</a>&nbsp;{@html postTypes.length != i + 1 ? '&bullet; ' : ''}
	{/each}
</p>

{#each postTypes as type}
	{@const url = type === 'gist' || type === 'quote' ? `/${type}s` : `/posts/${type}`}
	<h2 id={type}>
		<a href={url}>{type}s</a>
	</h2>
	{#if postsGroupedByType[type]}
		<ul>
			{#each postsGroupedByType[type] as post}
				<li><PostTitle {post} /></li>
			{/each}
		</ul>
	{/if}
{/each}

<style>
	p {
		margin-inline: 1rem;
		a {
			color: var(--light);
		}
	}
	h2 {
		text-transform: capitalize;
	}
	a {
		color: var(--accentFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
		text-decoration: none;
	}
	li {
		margin-bottom: 0.25rem;
	}
	@media (min-width: 1601px) {
		ul {
			column-count: 4;
		}
	}
	@media (min-width: 1201px) and (max-width: 1600px) {
		ul {
			column-count: 3;
		}
	}
	@media (min-width: 661px) and (max-width: 1200px) {
		ul {
			column-count: 2;
		}
	}
	@media (max-width: 660px) {
		ul {
			column-count: 1;
		}
	}
</style>
