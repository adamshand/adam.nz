<script lang="ts">
	import SEO from '$lib/components/SEO.svelte'
	import SocialIcons from '$lib/components/SocialIcons.svelte'

	let { data } = $props()

	const imageUrl = $derived(data.imageUrl)
	const location = '/contact'
	const title = 'Say hello?'
	const description = `Thanks for stopping by. It's always nice to hear from visitors, if you are so inclined, please drop me a note and say hello.`
</script>

<SEO {description} {imageUrl} {location} {title} />

<section>
	<div>
		<img alt="" src={data.imageUrl} />
	</div>

	<div>
		<h2>{title}</h2>
		<p>Thanks for stopping by.</p>
		<p>
			It's always nice to hear from visitors. If something here caught your interest, I'd love to
			hear about it.
		</p>
		<p>Or, just drop me a note and say hello. 👋🏻</p>
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
