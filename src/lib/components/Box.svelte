<script lang="ts">
	import type { Snippet } from 'svelte'
	let {
		children,
		background = false,
		border = false,
		columns = false,
		width = 'normal',
	}: {
		children: Snippet
		background?: boolean
		border?: boolean
		columns?: boolean
		width?: 'full' | 'narrow' | 'normal' | 'wide'
	} = $props()

	// FIXME: use class:backgroud etc
	let classes = $state('')
	if (background) classes += ' background'
	if (border) classes += ' border'
	if (columns) classes += ' columns'
	if (width === 'wide') {
		classes += ' wide'
	} else if (width === 'full') {
		classes += ' full'
	} else if (width === 'narrow') {
		classes += ' narrow'
	}
</script>

<div class={classes}>
	{@render children()}
</div>

<style>
	div.background {
		padding: 1rem;
		background-color: var(--darkContrast);
		border-radius: var(--borderRadius);
	}
	div.border {
		padding: 1rem;
		border: 1px solid var(--light);
		border-radius: var(--borderRadius);
	}
	div.columns {
		column-count: 2;
		column-rule: 1px dashed var(--light);
		column-gap: 2rem;
	}
	/* https://css-tricks.com/full-bleed/ */
	div.full {
		position: relative;
		width: 100vw;
		margin-left: -50vw;
		margin-right: -50vw;
		left: 50%;
		right: 50%;
	}
	div.narrow {
		margin-left: 3rem;
		margin-right: 3rem;
	}
	div.wide {
		width: calc(var(--textWidth) + 3rem);
		margin-left: -3rem;
	}
</style>
