<script lang="ts">
	import Preview from '$lib/components/comments/Preview.svelte'
	let { data, form } = $props()
	const comment = $derived(form?.preview?.comment ?? '')
	const location = $derived(form?.preview?.location ?? '')
	const title = $derived(form?.preview?.title ?? '')

	const showPreview = $derived(form?.preview?.success ?? false)
	const showSubmit = $derived(form?.submit?.success ?? false)
	// $inspect('comment/+page.svelte:', { form })
</script>

{#if showPreview}
	<Preview {comment} {location} {title} />
{/if}

{#if showSubmit}
	<h2>Thanks for your comment.</h2>
	<p>If you've commented previously, your comment should already be approved.</p>
	<p>
		If this is your first time commenting here, your comment is in the moderation queue and will be
		approved soon.
	</p>
	<p><a href={form?.submit?.comment.location + '#comments'}>Return to comments section</a>.</p>
{/if}
