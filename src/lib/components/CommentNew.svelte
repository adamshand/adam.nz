<script lang="ts">
	import { enhance } from '$app/forms'
</script>

<h2>What ya thinking?</h2>
<form action="?/previewComment" method="POST" use:enhance>
	<textarea
		maxlength="2048"
		minlength="5"
		name="comment"
		placeholder="Type your comment here (at least 5 chars) …"
		rows="5"
		spellcheck="true"
	></textarea>
	<button value="Preview">Preview</button>
</form>

<style>
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
		margin-top: 1rem;
	}
	textarea {
		width: 100%;
	}
	button {
		width: 25%;
	}
</style>
