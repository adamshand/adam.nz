<script lang="ts">
	import { page } from '$app/state'
</script>

<div>
	{#each page.data.types as type}
		{@const excludeTypes = ['meta']}
		{#if !excludeTypes.includes(type)}
			<span><a href="/posts/{type}">{type}s</a></span>
		{/if}
	{/each}
</div>

<style>
	div {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}
	span {
		padding: 0.3em 1em;
		border-radius: 21px;
		background-color: var(--darkContrast);
		font-size: 0.9em;
		font-weight: 400;
	}
	span a {
		color: var(--light);
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
	}
	a {
		color: var(--lightFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
</style>
