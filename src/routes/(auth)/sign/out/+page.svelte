<script lang="ts">
	import { browser } from '$app/environment'
	import { invalidateAll } from '$app/navigation'
	import { page } from '$app/stores'

	if (browser) {
		invalidateAll()
	}
</script>

<!-- TODO: redirect to / -->

<article>
	{#if $page.data.user == null}
		<h1>Goodbye! 😢</h1>
		<p>Would you like to <a href="/sign/in">sign in</a> again?</p>
	{/if}
</article>

<style>
	h1,
	p {
		text-align: center;
	}
</style>
