<script lang="ts">
	import { page } from '$app/state'
</script>

<h1>Oh no, something go boom!</h1>

<p>Very sorry! Something with submitting your design to our garment printer!</p>
<p>Please try again later, the nerds have been notified.</p>

{#if page.status === 500}
	<h1>Error: {page.status}</h1>
	<p>{page.error?.message}</p>
{/if}
