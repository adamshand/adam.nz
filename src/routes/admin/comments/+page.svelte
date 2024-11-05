<script lang="ts">
	import type { CommentType } from '$lib/types.js'
	import { formatDate, pbUrl } from '$lib/utils'
	import groupBy from 'just-group-by'

	let { data } = $props()

	const comments = $derived(groupBy(data.comments, (c: CommentType) => c.location))
	const locations = $derived(Object.keys(comments))
</script>

<h1>Unapproved Comments</h1>
{#each locations as location}
	<h3><a href={location}>{location}</a></h3>
	<ul>
		{#each comments[location] as comment}
			<li>
				{comment.name} &lt;{comment.email}&gt; {formatDate(comment.created)}
				<a href="{pbUrl}/_/#/collections?collectionId={comment.collectionId}&recordId={comment.id}"
					>✏️</a
				>

				<blockquote>{comment.text}</blockquote>
			</li>{/each}
	</ul>
{/each}

<style>
	ul {
		margin: 1rem;

		a {
			float: right;
		}
	}
	a {
		text-decoration: none;
	}
</style>
