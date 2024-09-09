<script lang="ts">
	/* eslint svelte/no-at-html-tags: 0 */
	import type { CommentType } from '$lib/types'
	import { page } from '$app/stores'
	import { formatDate } from '$lib/utils'
	import md5 from 'md5'
	import snarkdown from 'snarkdown'

	import Openmoji from '$lib/components/Openmoji.svelte'

	let {
		debug = false,
		comments,
		showCount = true,
	}: { debug?: boolean; comments: CommentType[]; showCount?: boolean } = $props()

	const hideComments = ['/', '/contact', '/my', '/projects', '/posts']
	const isAdmin = $derived($page.data?.user?.admin == true)
	// $inspect('Show.svelte:', { comments, showCount, hideComments, isAdmin })
</script>

{#if !hideComments.includes($page.url.pathname)}
	{#if showCount}
		<h3>
			<a id="comments">
				{#if comments.length === 1}
					1 comment
				{:else if comments.length > 1}
					{comments.length} comments
				{/if}
			</a>
		</h3>
	{/if}

	{#each comments as comment}
		{@const gravatarUrl = 'https://www.gravatar.com/'}
		{@const gravatarHash = md5(comment.email.trim().toLowerCase())}
		{@const me = comment.email === 'adam@shand.net'}
		<!-- User data https://en.gravatar.com/205e460b479e2e5b48aec07710c08d50.json -->

		{#snippet gravatar()}
			<img
				alt="Gravatar"
				height={64}
				src={gravatarUrl + 'avatar/' + gravatarHash + '?d=robohash'}
				width={64}
			/>
		{/snippet}

		<section>
			{#if comment.homepage}
				<a href={comment.homepage}>
					{@render gravatar()}
				</a>
			{:else}
				{@render gravatar()}
			{/if}

			<div class="comment" class:me class:unapproved={!comment.isApproved}>
				<p>{@html snarkdown(comment.text.replace(/</g, '&lt;'))}</p>

				Posted on {formatDate(comment.created)} by

				{#if comment.homepage}
					<a href={comment.homepage}>{comment.name}</a>
				{:else}
					{comment.name}
				{/if}
			</div>

			<div class="moderate" data-sveltekit-preload-data="false">
				{#if isAdmin}
					<a
						title="Approve comment"
						href="https://pb.haume.nz/_/#/collections?collectionId={comment.collectionId}&recordId={comment.id}"
					>
						<Openmoji id="270F" width="1.5rem" />
					</a>
					{#if !comment.isApproved}
						<a title="Approve comment" href="/api/comment?id={comment.id}&do=approve">
							<Openmoji id="2714" width="1.5rem" />
						</a>
					{/if}
					{#if comment.isApproved}
						<a title="Hide comment" href="/api/comment?id={comment.id}&do=hide">
							<Openmoji id="274C" width="1.5rem" />
						</a>
					{/if}
					<a title="Delete comment" href="/api/comment?id={comment.id}&do=delete">
						<Openmoji id="E262" width="1.5rem" />
					</a>
				{/if}
			</div>
		</section>

		{#if debug}
			<div class:debug>debug: {comment.domain}{comment.location} &lt;{comment.email}&gt;</div>
		{/if}
	{/each}
{/if}

<style>
	h3 {
		margin-top: 1rem;
	}
	section {
		display: grid;
		grid-template-columns: auto 1fr auto;
		margin-top: 1rem;
	}
	img {
		margin-right: 1rem;
		border-radius: 50%;
	}
	div {
		background-color: var(--darkContrast);
	}
	.comment {
		padding: 1rem;
		font-weight: 200;
		font-size: 0.9rem;
	}
	.moderate {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0.25rem;
	}
	#comments {
		text-decoration: none;
		color: var(--accentFaded);
	}
	.me {
		border-left: 5px solid var(--accent);
	}
	.unapproved {
		border-left: 5px solid var(--fuck);
	}
	.debug {
		font-weight: 200;
		color: var(--accentHover);
	}
	a {
		color: var(--light);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
	@media (max-width: 512px) {
		img {
			display: none;
			width: 50%;
			height: auto;
		}
	}
</style>
