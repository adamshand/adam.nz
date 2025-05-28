import { processSearchResults, fetchSearchResults } from '.'

export const load = async ({ locals, url }) => {
	const q = url.searchParams.get('q')?.trim() || '';

	if (!q) return { searching: [], q };

	// refactored to make it easier to test, not sure if this is a good idea
	const results = await fetchSearchResults(locals.pb, q, !!locals.user);
	const searching = processSearchResults(results, q);

	return { searching, q };
}
