<script lang="ts">
	let { children } = $props()
</script>

<article>
	{@render children()}
</article>

<style>
	article {
		margin-inline: auto;
		max-width: 40ch;
	}
</style>
