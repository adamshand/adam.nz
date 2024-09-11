<script lang="ts">
	// import { enhance } from '$app/forms'
	import { page } from '$app/stores'

	const title = $derived($page.data.post[0]?.title)
	// $inspect('Add.svelte:', { post: $page.data.post[0], title })
</script>

<h2>Share your thoughts?</h2>
<form action="/comment?/preview" method="POST">
	<!-- use:enhance breaks posting to /comment -->

	<textarea
		maxlength="2048"
		minlength="5"
		name="comment"
		placeholder="Type your comment here (at least 5 chars) …"
		rows="5"
		spellcheck="true"
	></textarea>

	<input type="hidden" value={$page.url.pathname} name="location" />
	<input type="hidden" value={title} name="title" />

	<button>Preview</button>
</form>

<style>
	h2 {
		margin-top: 2rem;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
	}
	textarea {
		width: 100%;
	}
	button {
		width: 25%;
	}
</style>
