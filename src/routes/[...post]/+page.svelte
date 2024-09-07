<script lang="ts">
	import { getPhotoUrl } from '$lib/pocketbase.svelte'
	import Post from '$lib/components/Post.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()
	const post = $derived(data.post[0])
	const imageUrl = $derived(getPhotoUrl(post))
</script>

<SEO
	imageUrl={imageUrl ? imageUrl : ''}
	location={post.location}
	title={post.title ? post.title : ''}
/>

<Post comments={data.comments} {post} />
