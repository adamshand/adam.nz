<script lang="ts">
	import { page } from '$app/stores'
</script>

{#if $page.status === 404}
	<h1>Post not found</h1>
	<p>
		Some things haven't been moved over from previous sites yet. If you're looking for something
		specific and can't find it, let me know and I'll try and summon it from the archives.
	</p>
{:else}
	<h1>{$page.status}</h1>
	<p>{$page.error?.message}</p>
{/if}
