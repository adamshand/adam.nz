<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { PostType } from '$lib/types'
	import { page } from '$app/stores'
	import PostMeta from './PostMeta.svelte'
	import PostTitle from './PostTitle.svelte'
	import groupBy from 'just-group-by'

	interface PostIndex {
		author?: string
		tag?: string
		type?: string
		year?: string
		showDrafts?: boolean
		showMeta?: boolean
		showType?: boolean
		sortByViews?: boolean
		groupByYear?: boolean
		maxPosts?: number
	}

	let {
		author = '',
		tag = '',
		type = '',
		year = '',
		showDrafts = false,
		showMeta = true,
		showType = true,
		sortByViews = false,
		groupByYear = false,
		maxPosts = 0,
	}: PostIndex = $props()

	// TODO: ??: if (groupByYear && sortByViews) throw error

	const posts = $derived.by(() => {
		let newPosts = $page.data.posts
		if (!showDrafts) newPosts = newPosts.filter((post: PostType) => post.status === 'public')
		if (author) newPosts = newPosts.filter((post: PostType) => post.author === author)
		if (tag) newPosts = newPosts.filter((post: PostType) => post.tags && post.tags.includes(tag))
		if (type) newPosts = newPosts.filter((post: PostType) => post.type === type)
		if (year)
			newPosts = newPosts.filter(
				(post: PostType) => new Date(post.created).getFullYear() === Number(year),
			)
		if (sortByViews) newPosts = newPosts.sort((a: PostType, b: PostType) => b.views - a.views)
		if (maxPosts) newPosts = newPosts.slice(0, maxPosts)

		if (groupByYear)
			// nicer, but only had browser support since March 2024
			// newPosts = Object.groupBy(newPosts, (post: PostType) => new Date(post.created).getFullYear())
			newPosts = groupBy(newPosts, (post: PostType) => String(new Date(post.created).getFullYear()))

		return newPosts
	})

	const postYears = $derived.by(() => {
		if (groupByYear) {
			return Object.keys(posts).reverse()
		}
		return []
	})
</script>

{#snippet showPost(post: PostType)}
	<div class="post">
		<PostTitle {post} />
		{#if showMeta}
			{#if showType}
				<PostMeta {post} showType />
			{:else}
				<PostMeta {post} />
			{/if}
		{/if}
	</div>
{/snippet}

<!-- TODO: Feels fugly, but not sure how to make it better -->
{#each postYears as year}
	<!-- if groupByYear -->
	<h2 id={year}>
		<a href="/posts/{year}">{year}</a>
	</h2>

	{#each posts[year] as post}
		{@render showPost(post)}
	{/each}
{:else}
	<!-- if not groupByYear -->
	{#each posts as post}
		{@render showPost(post)}
	{:else}
		<p>No matching posts found.</p>
	{/each}
{/each}

<style>
	h2 {
		margin-top: 1rem;
	}
	h2 a {
		color: var(--accentFaded);
		text-decoration: none;
	}
	h2 a:hover {
		color: var(--accentHover);
	}
</style>
