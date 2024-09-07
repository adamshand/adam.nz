<script lang="ts">
	import { page } from '$app/stores'
	import PostsIndex from '$lib/components/PostsIndex.svelte'
	import PostsTypes from '$lib/components/PostsTypes.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { yearRegex } from '$lib/utils'

	const slug = $derived($page.params.slug)
	const isYear = $derived(yearRegex.test(slug))
	const slugProps = $derived(isYear ? { year: slug } : { type: slug })
</script>

<SEO imageUrl="" title="Posts tagged {slug}" />

<PostsTypes />

<h1>{slug}{isYear ? '' : 's'}</h1>

<PostsIndex groupByYear={!isYear} showMeta showType={isYear} {...slugProps} />

<!-- same as above, but for posterity
<PostsIndex
	groupByYear={!isYear}
	showMeta
	showType={isYear}
	{...isYear ? { year: slug } : { type: slug }}
/> -->

<style>
	h1 {
		margin-top: 1rem;
		text-transform: capitalize;
	}
</style>
