<script lang="ts">
	import { page } from '$app/state'
	import { pbUrl } from '$lib/utils'

	const post = page.data.post ?? []
</script>

<div><b>Return to</b> <a href={post.location}>{post.title}</a></div>

<section>
	{#each post.photos as photo, index}
		{@const src = `${pbUrl}/api/files/${post.collectionId}/${post.id}/${photo}?thumb=320x0`}
		<a href="/slides/{post.id}/{index}">
			<img alt={post.title} {src} />
		</a>
	{/each}
</section>

<style>
	section {
		column-count: 2;
		margin-top: 0.2rem;
	}
	img {
		width: 100%;
		margin-bottom: 1rem;
	}
	@media (min-width: 1024px) {
		section {
			column-count: 3;
		}
	}
	@media (min-width: 1600px) {
		section {
			column-count: 4;
		}
	}
</style>
