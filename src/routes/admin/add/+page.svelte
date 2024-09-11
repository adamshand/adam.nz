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
		content: content.trim(),
		aside: aside.trim(),
		author: author.trim(),
		tags: tags
			.trim()
			.replace(/^[\s,]+/, '')
			.replace(/[\s,]+$/, '')
			.split(',')
			.map((tag) => tag.trim().toLowerCase())
			.sort(),
		type: 'quote',
		format: 'quote',
		status: 'public',
	}) as PostType
</script>

<form method="POST" use:enhance>
	<label
		>Quote
		<!-- svelte-ignore a11y_autofocus -->
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
		<h3>Preview</h3>
		<Quote {quote} />
	{/if}
</form>

<style>
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
		font-size: larger;
		font-weight: bolder;
	}
	textarea {
		height: 10rem;
	}
	h3 {
		margin: 0;
	}
</style>
