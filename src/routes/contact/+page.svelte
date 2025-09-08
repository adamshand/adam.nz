<script lang="ts">
	import SEO from '$lib/components/SEO.svelte'
	import SocialIcons from '$lib/components/SocialIcons.svelte'

	let { data } = $props()
	const imageUrl = $derived(
		'https://pb.haume.nz/api/files/xd6xm0awdmqjjln/9o319tz40d3xxa5/' + data.post.photos[0],
	)
	$inspect({ post: data.post, imageUrl })
	const location = data.post.location || ''
	const title = data.post.title || ''
	const description = `Thanks for stopping by. It's always nice to hear from visitors, if you are so inclined, please drop me a note and say hello.`
</script>

<SEO {description} {imageUrl} {location} {title} />

<section>
	<div>
		<img alt="" src={imageUrl} />
	</div>

	<div>
		<h2>{title}</h2>
		{@html data.post.content}
		<SocialIcons />
		<p>Cheers, <br />Adam.</p>
	</div>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	div {
		width: 100%;
	}
	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		border-radius: var(--borderRadius);
	}

	@media (min-width: 1024px) {
		section {
			flex-direction: row;
		}
		div {
			width: 50%;
		}
	}
</style>
