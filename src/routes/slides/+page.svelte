<script lang="ts">
	import { pbUrl } from '$lib/utils'
	let { data } = $props()
</script>

<section>
	<h1>Photo Albums</h1>

	{#each data?.albums as album}
		<hgroup>
			<h2><a href={album.location}>{album.title}</a></h2>
			<a href="/slides/{album.id}">{album.photos.length} photos</a>
		</hgroup>

		<div>
			{#each album.photos as photo, index}
				{@const src = `${pbUrl}/api/files/${album.collectionId}/${album.id}/${photo}?thumb=320x0`}
				<a href="/slides/{album.id}/{index}">
					<img alt={album.title} {src} />
				</a>
			{/each}
		</div>
	{/each}
</section>

<style>
	hgroup {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: baseline;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
	div {
		display: flex;
		flex-direction: row;
		flex-wrap: nowrap;
		align-items: center;
		gap: 0.3rem;

		width: 100%;
		margin-bottom: 1rem;

		overflow-x: scroll;
		overscroll-behavior-x: none; /* stops browser history activating from swipe at end of carousel */
		scroll-snap-type: x mandatory;
		scrollbar-width: none; /* Hide scrollbar for Firefox */
		-ms-overflow-style: none; /* Hide scrollbar for IE and Edge */
		overscroll-behavior-x: none; /* stops browser history activating from swipe at end of carousel */
	}
	img {
		height: 10rem;
		cursor: pointer;
		scroll-snap-align: start;
	}
	img:hover {
		opacity: 1;
	}
</style>
