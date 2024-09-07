<script lang="ts">
	import type { PostType } from '$lib/types'

	/* eslint svelte/no-at-html-tags: 0 */
	import { pbUrl } from '$lib/utils'

	import PostMeta from './PostMeta.svelte'
	import PostTitle from './PostTitle.svelte'

	function randomColor() {
		return `#${Math.floor(Math.random() * 16777215).toString(16)}`
	}

	let { post }: { post: PostType } = $props()
</script>

<section>
	<div>
		{#if post.photos?.length}
			{@const url = `${pbUrl}/api/files/${post.collectionId}/${post.id}/${post.photos[0]}?thumb=320x0`}
			<a href={post.location}>
				<img alt={post.title} loading="lazy" src={url} title={post.title} /></a
			>
		{:else}
			<div style="aspect-ratio: 1/1;  background-color: {randomColor()};"></div>
		{/if}
	</div>
	<div class="title">
		<PostTitle isSubHeader {post} />
	</div>
	<PostMeta center {post} showEdit={false} showType={false} showTags={false} />
</section>

<style>
	section {
		display: grid;
		gap: 5px;

		margin-bottom: 1rem;
		padding: 5px;
		border: 1px solid var(--lightFaded);
		border-bottom-left-radius: var(--borderRadius);
		border-bottom-right-radius: var(--borderRadius);
		break-inside: avoid;
	}
	img {
		width: 100%;
	}
	.title {
		/* margin-block: 5px; */
		padding-block: 1rem;
		text-align: center;
		background-color: var(--darkContrast);
	}
</style>
