<script lang="ts">
	import type { PostType } from '$lib/types'

	import { page } from '$app/state'
	import ProjectCard from '$lib/components/ProjectCard.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import Columns from '$lib/components/Columns.svelte'
	let posts = $derived(page.data.posts.filter((post: PostType) => post.type === 'project'))
</script>

<SEO imageUrl="" location={page.url.pathname} title="Projects" />

<h1>All Projects</h1>

<section>
	{#each posts as post}
		<ProjectCard {post} />
	{/each}
</section>

<style>
	section {
		columns: 2;
	}
	/* https://www.freecodecamp.org/news/the-100-correct-way-to-do-css-breakpoints-88d6a5ba1862/ */
	@media (min-width: 600px) {
		section {
			columns: 3;
		}
	}
	@media (min-width: 900px) {
		section {
			columns: 3;
		}
	}
	@media (min-width: 1200px) {
		section {
			columns: 4;
		}
	}
</style>
