<script lang="ts">
	import type { Snippet } from 'svelte'

	let {
		children,
		gap = '0.5rem',
		columns = '2',
	}: { children: Snippet; gap?: string; columns?: string } = $props()
</script>

<section class="grid" style="--columns: {columns}; --gap: {gap};">
	{@render children()}
</section>

<style>
	section.grid {
		display: grid;
		grid-template-columns: repeat(var(--columns), 1fr);
		align-items: start;
		gap: var(--gap);
	}

	@media (min-width: 768px) {
		section.grid {
			grid-template-columns: repeat(calc(var(--columns) + 1), 1fr);
		}
	}

	@media (min-width: 1024px) {
		section.grid {
			grid-template-columns: repeat(calc(var(--columns) + 2), 1fr);
		}
	}
	@media (min-width: 1600px) {
		section.grid {
			grid-template-columns: repeat(calc(var(--columns) + 3), 1fr);
		}
	}
</style>
