<script lang="ts">
	import { getPhotoUrl } from '$lib/pocketbase.svelte'
	import Post from '$lib/components/Post.svelte'
	import SEO from '$lib/components/SEO.svelte'

	let { data } = $props()
	const post = $derived(data.post)
	const imageUrl = $derived(getPhotoUrl(post))
</script>

<SEO imageUrl={imageUrl || ''} location={post.location} title={post.title || ''} />

<Post comments={data.comments} {post} />
