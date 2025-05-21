<script lang="ts">
	import type { PostType } from '$lib/types'
	import { page } from '$app/state'
	import { pbUrl } from '$lib/utils'
	import { stripHtml } from '$lib'

	const drafts = $derived(page.data.posts.filter((post: PostType) => post.status === 'draft'))

	const unlistedPosts = $derived(
		page.data.posts.filter(
			(post: PostType) =>
				post.status == 'unlisted' &&
				post.format == 'post' &&
				post.category != 'meta' &&
				post.category != 'project',
		),
	)
	const unlistedOther = $derived(
		page.data.posts.filter((post: PostType) => post.status == 'unlisted' && post.format != 'post'),
	)

	const secret = $derived(page.data.posts.filter((post: PostType) => post.status === 'secret'))
	// $inspect(page.data.posts)
</script>

<h1>Manage Posts</h1>

<h2>Secret Posts</h2>
<ul>
	{#each secret as post}
		{@const url = `${pbUrl}/_/#/collections?collectionId=${post.collectionId}&recordId=${post.id}`}
		<li>[{post.format}] <a href={`/id/${post.id}`}>{post.title}</a> (<a href={url}>edit</a>)</li>
	{:else}
		<p>No secret posts.</p>
	{/each}
</ul>

<h2>Drafts Posts</h2>
<ul>
	{#each drafts as post}
		{@const url = `${pbUrl}/_/#/collections?collectionId=${post.collectionId}&recordId=${post.id}`}
		<li><a href={`/id/${post.id}`}>{post.title}</a> (<a href={url}>edit</a>)</li>
	{:else}
		<p>No draft posts.</p>
	{/each}
</ul>

<h2>Unlisted Posts</h2>
<p>Excluding category meta & project.</p>
<ul>
	{#each unlistedPosts as post}
		{@const url = `${pbUrl}/_/#/collections?collectionId=${post.collectionId}&recordId=${post.id}`}
		<li>
			<a href={`/id/${post.id}`}>{post.title}</a> (<a href={url}>edit</a>)
		</li>
	{:else}
		<p>No unlisted posts.</p>
	{/each}
</ul>

<h2>Unlisted Non-posts</h2>
<ul>
	{#each unlistedOther as post}
		{@const url = `${pbUrl}/_/#/collections?collectionId=${post.collectionId}&recordId=${post.id}`}
		<li>
			[{post.format}]
			<a href={`/id/${post.id}`}>{post.title || stripHtml(post.content).slice(0, 128)}</a>
			(<a href={url}>edit</a>)
		</li>
	{:else}
		<p>No unlisted posts.</p>
	{/each}
</ul>

<style>
	a {
		text-decoration: none;
	}
</style>
