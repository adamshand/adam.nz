<script lang="ts">
	import { page } from '$app/state'
	let { children } = $props()
</script>

<section>
	<header>Admin Dashboard for @{page.data.user?.username}</header>

	{@render children()}

	<footer data-sveltekit-preload-data="false">
		<a href="/sign/out">Sign Out</a>
	</footer>
</section>

<style>
	section {
		outline: 3px solid var(--darkContrast);
		padding: 1rem;
	}
	header,
	footer {
		text-align: center;
		margin-block: 1rem;
	}
	header {
		font-size: larger;
		font-weight: bolder;
	}
</style>
