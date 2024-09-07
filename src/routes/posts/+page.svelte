<script lang="ts">
	import PostsIndex from '$lib/components/PostsIndex.svelte'
	import PostsTypes from '$lib/components/PostsTypes.svelte'
</script>

<PostsTypes />

<h1>All Posts</h1>

<PostsIndex groupByYear showMeta />

<style>
	h1 {
		margin-top: 1rem;
	}
</style>
