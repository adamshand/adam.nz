// pulls title from blogpost (first line or first sentence) and removes leading/trailing html
// eslint-disable-next-line no-control-regex
// export const splitPostRegex = new RegExp('^(<[^>]+>)?([^.<\n]+)[.?!]?(</[^>]+>)?')
export const splitPostRegex = new RegExp('^(<[^>]+>)?([^<\n]+)[.?!]?(</[^>]+>)?')
// const deHtmlRegex = /<\/?[A-z0-9][^<]*>/gi

export const splitPost = (post: string) => {
	const titleAndBody = post.match(splitPostRegex)
	const title = titleAndBody ? titleAndBody[2] : ''
	const body = post.replace(splitPostRegex, '')
	return { title, body }
}
