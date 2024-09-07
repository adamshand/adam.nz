<script lang="ts">
	import type { CommentType } from '$lib/types'

	/* eslint svelte/no-at-html-tags: 0 */
	import { page } from '$app/stores'
	import { formatDate } from '$lib/utils'
	import md5 from 'md5'
	import snarkdown from 'snarkdown'

	import Openmoji from './Openmoji.svelte'

	// export let debug = false
	// export let comments: CommentType[]

	let { debug = false, comments }: { debug?: boolean; comments: CommentType[] } = $props()
	const hideComments = ['/blahblahadsf']
</script>

{#if !hideComments.includes($page.url.pathname)}
	<h3>
		<a id="comments">
			{#if comments.length === 1}
				1 comment
			{:else if comments.length > 1}
				{comments.length} comments
			{/if}
		</a>
	</h3>

	{#each comments as comment}
		{@const gravatarUrl = 'https://www.gravatar.com/'}
		{@const gravatarHash = md5(comment.email.trim().toLowerCase())}
		{@const isMe = comment.email === 'adam@shand.net'}
		<!-- User data https://en.gravatar.com/205e460b479e2e5b48aec07710c08d50.json -->

		<section>
			{#if comment.homepage}
				<a aria-label="Commenters homepage" href={comment.homepage}>
					<img
						alt="Gravatar"
						height={64}
						src={gravatarUrl + 'avatar/' + gravatarHash + '?d=robohash'}
						width={64}
					/></a
				>
			{:else}
				<img
					alt="Gravatar"
					height={64}
					src={gravatarUrl + 'avatar/' + gravatarHash + '?d=robohash'}
					width={64}
				/>
			{/if}

			<div class:me={isMe} class:unapproved={!comment.isApproved}>
				<!-- FIXME: ghetto sanitisation, needs proper xss safety -->
				<p>{@html snarkdown(comment.text.replace(/</g, '&lt;'))}</p>
				<div class="meta">
					<span>
						Posted on {formatDate(comment.created)} by
						{#if comment.homepage}
							<a href={comment.homepage}>{comment.name}</a>
						{:else}
							{comment.name}
						{/if}
					</span>
					{#if !comment.isApproved}
						<span id="moderation">
							<form action="/admin/comments?/delete" method="POST">
								<input hidden name="id" required value={comment.id} />
								<input hidden name="location" required value={comment.location} />
								<button><Openmoji id="274C" width="24" /></button>
							</form>
							<form action="/admin/comments?/approve" method="POST">
								<input hidden name="id" required value={comment.id} />
								<input hidden name="location" required value={comment.location} />
								<button><Openmoji id="2714" width="24" /></button>
							</form>
						</span>
					{/if}
				</div>
				<i>
					{#if debug}
						<br />debug: {comment.domain}{comment.location} &lt;{comment.email}&gt;
					{/if}
				</i>
			</div>
		</section>
	{/each}
{/if}

<style>
	#moderation {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	h3 {
		margin-top: 1rem;
	}
	section {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		margin-top: 1rem;
	}
	img {
		margin: 0rem 1rem auto auto;
		border-radius: 50%;
		border: 1px solid var(--whiteFaded);
	}
	div {
		width: 100%;
		padding: 1rem;
		background-color: var(--darkContrast);
		font-weight: 200;
		font-size: 0.9rem;
	}
	.me {
		border-left: 5px solid var(--accent);
	}
	.meta {
		padding: 0;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
	.meta a {
		text-decoration: none;
	}
	.unapproved {
		border-left: 5px solid var(--fuck);
	}
	span {
		text-align: right;
		color: var(--lightContrast);
	}
	i {
		font-weight: 200;
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
