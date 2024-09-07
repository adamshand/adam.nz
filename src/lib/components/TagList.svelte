<script lang="ts">
	let { tags }: { tags: string[] } = $props()
</script>

{#if tags.length != 0}
	<span class="tags">
		in
		{#each tags.toSorted() as tag, index}
			<b>#</b><a href="/search/tag/{tag.toLowerCase().trim()}">{tag.trim()}</a
			>{#if index + 2 === tags.length}&ensp;&amp;
			{:else if index + 1 < tags.length},{/if}&ensp;
		{/each}
	</span>
{/if}

<style>
	a {
		color: var(--lightFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
	b {
		padding-right: 0.05rem;
		color: var(--accentFaded);
	}
</style>
