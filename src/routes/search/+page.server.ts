import type { PostType } from '$lib/types'
import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte.js'
import { stripHtml } from '$lib'

function extractSnippet(text: string, q: string, radius = 60) {
	const index = text.toLowerCase().indexOf(q.toLowerCase());
	if (index === -1) return text.slice(0, radius * 2) + '...';
	const start = Math.max(0, index - radius);
	const end = Math.min(text.length, index + q.length + radius);
	let snippet = text.slice(start, end).trim();
	snippet = snippet.replace(new RegExp(`(${q})`, 'i'), '<mark>$1</mark>');
	return (start > 0 ? '... ' : '') + snippet + (end < text.length ? ' ...' : '');
}

export const load = async ({ locals, url }) => {
	const q = url.searchParams.get('q')?.trim() || '';

	if (!q) return { searching: [], q };

	let searching

	try {
		const results = await locals.pb.collection(pbAdamnzId).getFullList({
			filter: `format != 'book' && aside ~ "${q}" || author ~ "${q}" || content ~ "${q}" || title ~ "${q}"`,
		})

		searching = results
			.filter((post: PostType) => post.format !== 'book')
			.map((post: PostType) => {
				const plain = stripHtml(post.content);

				let content
				if (post.format == 'post') {
					content = extractSnippet(plain, q);
				} else {
					content = post.content
				}
				return { ...post, content };
			});
	} catch (err) {
		pbError(err)
	}

	return { searching, q };
}
