<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { CommentType, PostType } from '$lib/types'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'

	import { env } from '$env/dynamic/public'

	import Add from '$lib/components/comments/Add.svelte'
	import Show from '$lib/components/comments/Show.svelte'
	import PostMeta from '$lib/components/PostMeta.svelte'
	import PostSlider from '$lib/components/PostSlider.svelte'
	import PostTitle from '$lib/components/PostTitle.svelte'

	let { post, comments }: { post: PostType; comments: CommentType[] } = $props()

	const showComments = $derived(env.PUBLIC_FF_SHOW_COMMENTS === 'true')
	const allowCommenting = $derived(env.PUBLIC_FF_ALLOW_COMMENTING === 'true')
	const photoCount = $derived(post.photos?.length ? post.photos.length : 0)
	const hasAside = $derived(post.aside || post.type === 'manifesto' || post.type === 'archive')
	const hasSecondaryAside = $derived(post.type === 'manifesto' || post.type === 'archive')
	const isCarnivore = $derived(
		post.location?.startsWith('/carnivore') && post.location != '/carnivore/story',
	)
</script>

{#if photoCount === 1}
	<a href={`/slides/${post.id}/0`}>
		<img alt={post.title} id="feature" src={getPhotoUrl(post)} title={post.title} />
	</a>
{:else if photoCount > 1}
	<PostSlider {post} />
{/if}

<PostTitle isHeader={true} {post} />

{#if hasAside}
	<aside>
		{@html post.aside}
	</aside>
{/if}

<div id="post">
	{@html post.content}
</div>

<PostMeta {post} overline />

{#if post.type === 'manifesto'}
	<aside>
		<p>
			I love manifestos and have been <a href="/posts/manifesto"
				>collecting them since I was a teenager</a
			>. I love the passion which led to their creation and how they uniquely represent the author
			and the time in which they were written. Such is my excitement, that I even instigated and
			co-wrote the <a href="/wireless-commons">Wireless Commons Manifesto</a>.
		</p>
	</aside>
{:else if post.type === 'archive'}
	<aside>
		<p>
			This page is part of <a href="/posts/archive">my archive of other people's writing</a>. I
			typed some of these in by hand from much loved original sources. Others were copied from
			somewhere online. All of them are here because at the moment I read them, they struck a chord
			within me.
		</p>
		<p>
			Most of the pages in my archive have been copied without permission. All of them remain under
			the copyright of the original author. Where I was able, I have included attribution to the
			original author and linked to the original source.
		</p>
		<p>
			If any of these writings belong to you, and you would like them removed or the attribution
			changed, please let me know.
		</p>
	</aside>
{:else if isCarnivore}
	<aside>
		<p>
			If something doesn't make sense. If information is missing or incorrect. If you have an idea
			on how to make this guide better. Please let me know. I read every comment and want to make
			this guide as helpful as possible.
		</p>
	</aside>
{/if}

{#if showComments}
	{#if allowCommenting}
		<Add />
	{/if}
	<Show {comments} />
{/if}

<style>
	:global(#post img) {
		/* images include in post.content */
		width: 100%;
		height: auto;
		margin-bottom: 1rem;
		border-radius: var(--borderRadius);
	}
	#feature {
		/* single header image */
		/* width: var(--textWidth) */
		width: 100%;
		max-height: 33vh;
		margin-bottom: 1rem;
		object-fit: cover;
	}
	@media (max-width: 768px) {
		:global(#post img) {
			float: none;
		}
	}
	@media (min-width: 768px) {
		:global(#post img[style*='float: left']) {
			width: calc(var(--textWidth) / 2);
			margin-left: calc(var(--textWidth) / 6 * -1);
			margin-right: 1rem;
		}
		:global(#post img[style*='float: right']) {
			width: calc(var(--textWidth) / 2);
			margin-right: calc(var(--textWidth) / 6 * -1);
			margin-left: 1rem;
		}
		:global(#post img[style*='margin-left: auto']) {
			width: calc(100% + 6rem);
			margin-left: -3rem !important;
		}
	}
</style>
