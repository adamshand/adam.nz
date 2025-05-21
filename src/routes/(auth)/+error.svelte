<script lang="ts">
	import { page } from '$app/state'

	// const status = $derived(page.status)
	const message = $derived(page.error?.message)
</script>

<article>
	<h1>{message}</h1>
	{#if page.url.pathname == '/sign/in'}
		<p>Something went wrong when you were trying to sign in.</p>
		<p>Please <a href="/sign/in">sign in</a> again.</p>
	{/if}
</article>

<style>
	article {
		display: grid;
		gap: 1rem;
	}
	h1 {
		color: var(--brand);
	}
</style>
