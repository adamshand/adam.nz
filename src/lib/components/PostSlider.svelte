<script lang="ts">
	import type { PostType } from '$lib/types'
	import { pbUrl } from '$lib/utils'

	let { post }: { post: PostType } = $props()

	// const photos = post.photos ? shuffled(post.photos) : []
	const photos = post.photos ?? []
</script>

<section>
	{#each photos as photo, index}
		{@const url = `${pbUrl}/api/files/${post.collectionId}/${post.id}/${photo}`}
		<a href="/slides/{post.id}/{index}">
			<img alt={post.title} loading="lazy" src={url} title={post.title} />
		</a>
	{/each}
	<div>
		<!-- TODO: dots shouldn't scroll with first image. put dots in <section> -->
		{#each photos as photo, index}
			<a href="/slides/{post.id}/{index}">&#9679;</a>
		{/each}
	</div>
</section>

<style>
	section {
		position: relative;

		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		gap: 0.5rem;

		width: 100%;
		margin-bottom: 1rem;

		scroll-snap-type: x mandatory;
		overflow-x: scroll;
		scrollbar-width: none; /* Hide scrollbar for Firefox */
		-ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
		overscroll-behavior-x: none; /* stops browser history activating from swipe at end of carousel */

		img {
			height: 42vh;
			width: auto;
			object-fit: contain;
			opacity: 0.85;
			cursor: pointer;
			scroll-snap-align: center;
		}
		img:hover {
			opacity: 1;
		}
	}
	section::-webkit-scrollbar {
		display: none; /* Hide scrollbar for Chrome, Safari, and Opera */
	}

	div {
		position: absolute;
		bottom: 5px;
		left: 50%;
		transform: translateX(-50%);

		padding-inline: 0.5rem 0;
		border-radius: var(--borderRadius);
		background-color: rgba(0, 0, 0, 0.3);

		a {
			font-weight: 900;
			font-size: 1.3rem;
			letter-spacing: 0.6rem;
			text-decoration: none;
		}
	}
</style>
