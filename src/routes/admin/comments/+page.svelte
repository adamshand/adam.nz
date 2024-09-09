<script lang="ts">
	import type { CommentType } from '$lib/types.js'
	import { formatDate, pbUrl } from '$lib/utils'
	import groupBy from 'just-group-by'

	let { data } = $props()

	const comments = $derived(groupBy(data.comments, (c: CommentType) => c.location))
	const locations = $derived(Object.keys(comments))
</script>

{#each locations as location}
	<h2>{location}</h2>
	<ul>
		{#each comments[location] as comment}
			<li>
				<a href="{pbUrl}/_/#/collections?collectionId={comment.collectionId}&recordId={comment.id}"
					>✏️</a
				>
				{comment.name} &lt;{comment.email}&gt; {formatDate(comment.created)}
				<blockquote>{comment.text}</blockquote>
			</li>{/each}
	</ul>
{/each}

<style>
	ul {
		margin: 1rem;
	}

	a {
		text-decoration: none;
	}
</style>
