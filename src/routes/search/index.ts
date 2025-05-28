import type { PostType } from '$lib/types'
import { pbAdamnzId } from '$lib/utils'
import { pbError } from '$lib/pocketbase.svelte.js'
import { stripHtml } from '$lib'
import type PocketBase from 'pocketbase'

function escapeRegExp(str: string) {
  // takes unsafe regex characters and escapes them with \
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function adjustToWordBoundary(text: string, idx: number, direction: 'back' | 'forward') {
  const isWordChar = (c: string) => /\w/.test(c);
  if (direction === 'back') {
    while (idx > 0 && isWordChar(text[idx - 1])) idx--;
  } else {
    while (idx < text.length && isWordChar(text[idx])) idx++;
  }
  return idx;
}

function extractSnippet(text: string, q: string, radius = 60) {
  const match = new RegExp(escapeRegExp(q), 'i').exec(text);
  if (!match) return text.slice(0, radius * 2) + '...';
  const index = match.index;

  const rawStart = Math.max(0, index - radius);
  const rawEnd = Math.min(text.length, index + q.length + radius);
  const start = adjustToWordBoundary(text, rawStart, 'back');
  const end = adjustToWordBoundary(text, rawEnd, 'forward');

  let snippet = text.slice(start, end).trim();
  const safeQ = escapeRegExp(q);
  snippet = snippet.replace(new RegExp(`(${safeQ})`, 'i'), '<mark>$1</mark>');

  return (start > 0 ? '... ' : '') + snippet + (end < text.length ? ' ...' : '');
}

export async function fetchSearchResults(pb: PocketBase, query: string, isAuthenticated: boolean) {
  if (!query) return [];

  try {
    const results: PostType[] = await pb.collection(pbAdamnzId).getFullList({
      filter: `
			  ${isAuthenticated ? '' : 'status = "public" && '} 
				format != 'book' && 
				(aside ~ "${query}" || author ~ "${query}" || content ~ "${query}" || title ~ "${query}")`,
    })

    return results;
  } catch (err) {
    pbError(err)
    return [] // required for typescript
  }
}

export function processSearchResults(results: PostType[], query: string) {
  return results
    .filter((post: PostType) => post.format !== 'book')
    .map((post: PostType) => {
      const plain = stripHtml(post.content);

      let content
      if (post.format == 'post') {
        content = extractSnippet(plain, query);
      } else {
        content = post.content
      }
      return { ...post, content };
    });
}