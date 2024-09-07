<script lang="ts">
	import { goto } from '$app/navigation'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()

	const length = $derived(data.post?.photos.length)
	const index = $derived(Number(data.index))

	function gotoPrevSlide(idx: number, len: number) {
		const url = `/slides/${data.post.id}/${(idx - 1 + len) % len}`
		goto(url)
	}
	function gotoNextSlide(idx: number, len: number) {
		const url = `/slides/${data.post.id}/${(idx + 1) % len}`
		goto(url)
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'ArrowLeft') {
			gotoPrevSlide(index, length)
		} else if (event.key === 'ArrowRight') {
			gotoNextSlide(index, length)
		} else if (event.key === 'Escape') {
			goto(data.post.location)
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<SEO
	imageUrl={data.urlPrefix + data.post.photos[index]}
	location={`/slides/${data.post.id}/${index}`}
	title="Slide {index}/{length}: {data.post.title}"
/>

<div id="overlay">
	<button id="exit" onclick={() => goto(data.post.location)} title="Return to {data.post.title}"
		>&times;</button
	>
	<div id="wrapper">
		<button
			id="prev"
			onclick={() => gotoPrevSlide(index, length)}
			title="You can also use the left arrow key.">&#10094;</button
		>
		<div id="meta">
			<span>Return to <a href={data.post.location}>{data.post.title}</a></span>
			<span
				><a href={`/slides/${data.post.id}/`} title="See all photos">
					{index + 1}&nbsp;of&nbsp;{length}</a
				></span
			>
		</div>
		<img alt="" src={data.urlPrefix + data.post.photos[index]} />
		<button
			id="next"
			onclick={() => gotoNextSlide(index, length)}
			title="You can also use the right arrow key.">&#10095;</button
		>
	</div>
</div>

<style>
	#overlay {
		position: absolute;
		top: 0;
		left: 0;

		display: flex;
		justify-content: center;
		align-items: center;

		height: 100vh;
		width: 100vw;
		z-index: 9999;
		background-color: hsla(10, 20%, 10%, 0.95);
	}
	#wrapper {
		position: relative;
	}
	img {
		max-width: 90vw;
		max-height: 90vh;
		width: 100%;
		height: 100%;
		object-fit: contain;
	}
	button {
		display: flex;
		justify-content: center;
		align-items: center;

		width: 7vw;
		height: 7vw;
		padding: 0;
		margin: 0;
		background-color: transparent;

		color: hsla(100, 100%, 100%, 0.2);
		font-size: 5vw;
		font-weight: 600;
	}
	button:hover {
		background-color: hsla(100, 100%, 100%, 0.5);
		color: var(--dark);
	}
	#exit {
		/* border: 1px solid salmon; */
		position: absolute;
		top: 0.5rem;
		left: 0.5rem;

		width: 2rem;
		height: 2rem;
		font-size: 3rem;
		background-color: transparent;
		color: var(--lightFaded);
	}
	#exit:hover {
		color: var(--accentHover);
	}
	#prev {
		position: absolute;
		top: 50%;
		left: 10px;
		transform: translateY(-50%);
	}
	#next {
		position: absolute;
		top: 50%;
		right: 10px;
		transform: translateY(-50%);
	}
	#meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: smaller;
	}
	@media (max-width: 415px) {
		img {
			max-width: 99vw;
			max-height: 99vh;
			/* max-width: calc(100vw - 2rem);
			max-height: calc(100vh - 2rem); */
		}
		#meta {
			width: 95%;
		}
	}
</style>
