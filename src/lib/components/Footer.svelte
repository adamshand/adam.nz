<script lang="ts">
	import { page } from '$app/stores'

	const year = $state(new Date().getFullYear())

	const post = $derived.by(() => {
		if ($page.data?.post?.length) return $page.data.post[0]
		if ($page.data?.post) return $page.data?.post
		if ($page.data?.book) return $page.data?.book
		return undefined
	})

	const author = $derived(post ? post.author : undefined)

	const showFooter = $derived.by(() => {
		if ($page.url.pathname === '/') return false // can't use url array, because / matches everything
		if (['/quote', '/gist'].some((url) => $page.url.pathname.startsWith(url))) return false
		if (author === 'Adam Shand' || author === undefined) return true
		return false
	})
</script>

<footer>
	{#if $page.params.gistId}
		<p>Another <a href="/gist">random gist</a>?</p>
	{:else if $page.params.quoteId}
		<p>Another <a href="/quote">random quote</a>?</p>
	{/if}

	{#if showFooter}
		<a href="https://copyheart.org/">Copyheart </a>
		<strong>&hearts;</strong>
		<span>1994&ndash;{year} {author}. Sharing is an act of love. </span>
	{/if}
</footer>

<style>
	footer {
		padding: 1rem 0;
		color: var(--lightFaded);
		font-size: 0.9rem;
		text-align: center;
	}
	p {
		margin: 0;
	}
	strong {
		color: var(--accentFaded);
	}
	a {
		color: var(--lightFaded);
	}
</style>
