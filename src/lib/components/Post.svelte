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
	const manifestoAside = `<p>This page is part of my <a href="/manifestos">manifesto</a> collection.</p><p>There’s something about the passion and clarity that they strive for that inspires and amuses me. Once upon a time, I even wrote my own (see <a href="/wireless-commons">The Wireless Commons Manifesto</a>).</p>`
	const libraryAside = `<p>The documents below have been slowly collected since the late 90’s. Some of them I typed in by hand from much loved original sources, others I simply copied from somewhere online. All of them are here because at the moment I read them, they struck a chord within me.</p><p>Initially I saved bookmarks to my favourite writings, but over the years I discovered that links don’t last. More often then not when I went reread a story, or send a link to a friend, I found that it was no longer available.</p><p>Eventually I decided that if I wanted long term access to these writings, I had to keep copies of them myself. It didn’t take long to realise that if I was going to do that, I may as well share them with others.</p><p>Nearly all documents have been copied without permission and all of them remain under the copyright of the original author. Where I was able I have included attribution to the original author and site.</p><p>If any of these writings belong to you, and you would like them removed or the attribution changed, please let me know.</p>`

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

		{#if post.aside && hasSecondaryAside}
			<hr />
		{/if}

		{#if post.type === 'manifesto'}
			{@html manifestoAside}
		{:else if post.type === 'archive'}
			{@html libraryAside}
		{/if}
	</aside>
{/if}

<div id="post">
	{@html post.content}
</div>

<PostMeta {post} overline />

{#if isCarnivore}
	<div class="carnivore">
		<p>
			If something doesn't make sense. If information is missing or incorrect. If you have an idea
			on how to make this guide better. Please let me know. I read every comment and want to make
			this guide as helpful as possible.
		</p>
	</div>
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
	hr {
		border: 0;
		margin-block: 0rem 1rem;
		height: 1px;
		background-image: linear-gradient(to right, var(--light), var(--accentHover), var(--light));
	}
	div.carnivore {
		margin-top: 2rem;
		border: 1px solid var(--accentFaded);
		padding: 0.5rem;
		padding-bottom: 0;
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
