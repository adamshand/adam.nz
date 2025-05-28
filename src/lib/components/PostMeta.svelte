<script lang="ts">
	import TagList from '$lib/components/TagList.svelte'
	import type { PostType } from '$lib/types'

	let {
		center = false,
		overline = false,
		post,
		showEdit = true,
		showTags = true,
		showType = true,
	}: {
		center?: boolean
		overline?: boolean
		post: PostType
		showEdit?: boolean
		showTags?: boolean
		showType?: boolean
	} = $props()

	const year = $derived(new Date(post.created).getFullYear())
	const dayMonth = $derived(
		new Date(post.created).toLocaleDateString('en-NZ', {
			day: 'numeric',
			month: 'short',
		}),
	)
</script>

<footer class:center class:overline>
	<div>
		{#if showType && post.type !== 'meta'}
			<span class="category">
				<a href="/posts/{post.type}">{post.type}</a>
			</span>
		{/if}

		<span
			>Posted
			{#if post.created}
				on {dayMonth}
				<a href="/posts/{year}" id="created">{year}</a>
			{/if}
			{#if showTags && post.tags?.length}
				<TagList tags={post.tags} />
			{/if}
		</span>
	</div>
</footer>

<style>
	footer {
		display: flex;
		justify-content: space-between;
		align-items: end;
		gap: 1rem;

		padding-top: 0.2rem;
		color: var(--lightFaded);
		font-size: 0.85rem;
		font-weight: 200;
	}
	.center {
		justify-content: center;
	}

	.overline {
		margin-top: 1.5rem;
		border-top: 0.5px solid var(--lightFaded);
	}
	span {
		/* outline: 1px solid hotpink; */
		padding-block: 0.3em 0.3em;
	}
	.category {
		padding: 0.3em 0.6em 0.3em 0.4em;
		border-bottom-right-radius: 11px;
		border-top-right-radius: 11px;
		background-color: var(--darkContrast);
		font-size: 0.7em;
		font-weight: 400;
		text-transform: uppercase;

		a {
			color: var(--lightFaded);
			font-weight: 700;
			letter-spacing: 0.05em;
		}
	}
	a {
		color: var(--lightFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
</style>
