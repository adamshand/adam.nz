<script lang="ts">
	import type { PostType } from '$lib/types'

	import Columns from '$lib/components/Columns.svelte'
	import SEO from '$lib/components/SEO.svelte'
	import { getRandomElement, pbUrl } from '$lib/utils'
	import { getPhotoUrl } from '$lib/pocketbase.svelte'

	import Book from './Book.svelte'

	let { data }: { data: { books: PostType[] } } = $props()

	// not derived because it's just for seo metadata (not reactive)
	let seoBook = getRandomElement(data?.books)
	let seoImageUrl = getPhotoUrl(seoBook)
	console.log('seoImageUrl', seoImageUrl)

	const description =
		'Books which are relevant to permaculturalists and are about New Zealand or written by New Zealanders.'

	function sortBooks(sortBy: string) {
		const stripTitle = (title: string) => {
			return title.replace(/^\s*(an|a|the|te)\s+/i, '')
		}

		return [...data.books].sort((a, b) => {
			switch (sortBy) {
				case 'actualCreated':
					if (a.actualCreated === undefined) return 1
					if (b.actualCreated === undefined) return -1
					return new Date(b.actualCreated).getTime() - new Date(a.actualCreated).getTime()
				case 'author':
					if (a.author === undefined) return 1
					if (b.author === undefined) return -1
					return a.author.localeCompare(b.author)
				case 'updated':
					if (a.updated === undefined) return 1
					if (b.updated === undefined) return -1
					return new Date(b.updated).getTime() - new Date(a.updated).getTime()
				case 'title':
					if (a.title === undefined) return 1
					if (b.title === undefined) return -1
					return stripTitle(a.title).localeCompare(stripTitle(b.title))
				default:
					return 0
			}
		})
	}

	let sortBy = $state('title')
	let sortedBooks = $derived(sortBooks(sortBy))
</script>

<SEO {description} imageUrl={seoImageUrl} title="NZ Permaculture Books" />

<h1>NZ Permaculture Books</h1>

<p>{description}</p>

<p>
	Contributions are welcome! But please note that for the moment, I'm only adding books which are
	currently in print. 🌻 🐓 🌳
</p>

<p>
	If you are looking general recommendations on permaculture and regenerative agriculture, <a
		href="https://johnkempf.com/johns-recommended-reading-list/"
		>John Kempf maintains an excellent list of books</a
	>.
</p>

<div id="sorting">
	<span>{sortedBooks.length} books</span>
	<form>
		<label>
			sort by &nbsp;
			<select bind:value={sortBy}>
				<option value="author">author</option>
				<option value="updated">added</option>
				<option value="actualCreated">published</option>
				<option value="title">title</option>
			</select>
		</label>
	</form>
</div>

<Columns>
	{#if sortedBooks}
		{#each sortedBooks as book}
			<Book {book} {sortBy} />
		{/each}
	{/if}
</Columns>

<style>
	:global(.aside div, .aside p) {
		/* required to stop @html book.aside added extra vertical spacing */
		margin: 0;
		padding: 0;
	}
	div#sorting {
		width: 100%;
		margin-block: 0.5rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	form {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
	select {
		font-size: 0.85rem;
	}
</style>
