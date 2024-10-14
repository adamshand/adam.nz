<script lang="ts">
	import { browser } from '$app/environment'
	import { page } from '$app/stores'

	const title = $derived($page.data.post[0]?.title)
</script>

{#if browser}
	<h2>Share your thoughts?</h2>
	<form action="/comment?/preview" method="POST">
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
{/if}

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
