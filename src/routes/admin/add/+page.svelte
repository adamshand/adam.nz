<script lang="ts">
	import type { PostType } from '$lib/types'
	import { enhance } from '$app/forms'
	import Quote from '$lib/components/Quote.svelte'
	import { onMount } from 'svelte'

	let { data } = $props()

	let aside = $state('')
	let author = $state('')
	let content = $state('')
	let editor: string | HTMLElement
	let selectedTags = $state([])

	const filteredAuthors = $derived(
		author
			? data.authors.filter((a: string) => a.toLowerCase().includes(author.toLowerCase()))
			: [],
	)

	const quote = $derived({
		content: content.trim(),
		aside: aside.trim(),
		author: author.trim(),
		tags: selectedTags as string[],
		type: 'quote',
		format: 'quote',
		status: 'public',
	}) as PostType

	onMount(async () => {
		const { default: Quill } = await import('quill')

		let quill = new Quill(editor, {
			theme: 'bubble',
			// placeholder: 'Write your quote...',
			modules: {
				toolbar: [
					['bold', 'italic', 'underline', 'strike'],
					['link'],
					[{ background: [] }],
					['clean'],
				],
			},
		})

		quill.focus()
		quill.on('text-change', () => {
			content = quill.root.innerHTML
		})
	})
</script>

<form method="POST" use:enhance>
	<div bind:this={editor} id="quill">
		<!-- <p>Default content</p> -->
	</div>

	<input type="hidden" name="content" bind:value={content} />

	<label
		>Aside
		<input type="text" bind:value={aside} name="aside" />
	</label>

	<label>
		Author
		<input bind:value={author} list="authors" name="author" multiple />
		<datalist id="authors">
			{#each filteredAuthors as matchingAuthor}
				<option value={matchingAuthor}></option>
			{/each}
		</datalist>
	</label>

	<label
		>Tags
		<select multiple bind:value={selectedTags} name="tags" role="listbox">
			{#each data.tags.sort() as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
	</label>

	<input type="hidden" value={JSON.stringify(quote)} name="quote" />

	<button>Submit</button>

	{#if quote.content}
		<h3>Preview</h3>
		<Quote {quote} />
	{/if}
</form>

<!-- <label>
		Author
		<input type="text" bind:value={author} name="author" />
	</label>

	{#if filteredAuthors.length > 0}
		<ul class="suggestions">
			{#each filteredAuthors as matchingAuthor}
				{#if matchingAuthor !== author}
	        <li onclick={() => (author = matchingAuthor)}>{matchingAuthor}</li>
				{/if}
			{/each}
		</ul>
	{/if} -->

<style>
	@import url('https://cdn.quilljs.com/1.3.6/quill.bubble.css');

	:global(.ql-bubble .ql-toolbar) {
		background-color: var(--darkTransparent);
		border-radius: 8px;
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}

	form {
		display: grid;
		gap: 1rem;
	}

	#quill,
	datalist,
	label,
	input,
	textarea,
	select {
		width: 100%;
	}
	label {
		font-size: larger;
		font-weight: bolder;
	}
	textarea,
	#quill {
		height: 10rem;
	}
	h3 {
		margin: 0;
	}
</style>
