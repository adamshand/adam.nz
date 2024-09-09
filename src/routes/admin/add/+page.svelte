<script lang="ts">
	import type { PostType } from '$lib/types'
	import { enhance } from '$app/forms'
	import Quote from '$lib/components/Quote.svelte'

	let aside = $state('')
	let author = $state('')
	let content = $state('')
	let tags = $state(
		'breaking, connecting, crying, daring, designing, eating, failing, healing, imagining, inspiring, laughing, loving, making, nerding, playing, reflecting, talking, teaching, travelling, wanting, wilding, working',
	)

	const quote = $derived({
		content,
		aside,
		author,
		tags: tags.split(',').map((tag) => tag.trim()),
		type: 'quote',
		format: 'quote',
		status: 'public',
	})
	const quotePreview: PostType = $derived({
		id: '',
		created: '',
		updated: '',
		collectionId: '',
		collectionName: '',
		content,
		aside,
		author,
		tags: tags.split(',').map((tag) => tag.trim()),
		type: 'quote',
		format: 'quote',
		status: 'public',
		views: 0,
	})
</script>

<section>
	<form method="POST" use:enhance>
		<label
			>Quote
			<textarea autofocus bind:value={content} name="content"> </textarea>
		</label>
		<label
			>Aside
			<input type="text" bind:value={aside} name="aside" />
		</label>
		<label
			>Author
			<input type="text" bind:value={author} name="author" />
		</label>
		<label
			>Tags
			<input bind:value={tags} name="author" placeholder="comma seperated tags" />
		</label>

		<input type="hidden" value={JSON.stringify(quote)} name="quote" />

		<button>Submit</button>

		{#if quote.content}
			<div>
				<h3>Preview</h3>
				<Quote quote={quotePreview} />
			</div>
		{/if}
	</form>
</section>

<style>
	section {
		/* outline: 1px solid pink; */
		margin-inline: auto;
		padding: 0.5rem;
		width: 66ch;
	}
	form {
		display: grid;
		gap: 1rem;
	}
	label,
	input,
	textarea {
		width: 100%;
	}
	label {
		padding-block: 0.5rem;
		font-size: larger;
		font-weight: bolder;
	}
	textarea {
		height: 10rem;
	}
</style>
