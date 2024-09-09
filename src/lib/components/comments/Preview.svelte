<script lang="ts">
	import { enhance } from '$app/forms'
	import Show from '$lib/components/comments/Show.svelte'

	let { comment, location, title }: { comment: string; location: string; title: string } = $props()

	let email = $state('')
	let homepage = $state('')
	let name = $state('')

	let preview = $derived({ created: new Date(), email, text: comment, location, name, homepage })

	// $inspect('comment/Preview.svelte:', preview)
</script>

<section>
	<h2>Commenting on <a href={location}>{title}</a></h2>
	<form action="?/submit" method="POST" use:enhance>
		<textarea
			bind:value={comment}
			maxlength="2048"
			minlength="5"
			name="comment"
			rows="10"
			spellcheck="true"
		></textarea>

		<label>
			Name:
			<input bind:value={name} name="name" placeholder="required" required type="text" />
		</label>
		<label>
			Email:
			<input bind:value={email} name="email" placeholder="required" required type="email" />
		</label>
		<label>
			Homepage:
			<input bind:value={homepage} name="homepage" type="url" placeholder="optional" />
		</label>

		<input type="hidden" value={location} name="location" />

		<button>Submit </button>
	</form>

	<h2>Preview</h2>
	<Show comments={[preview]} showCount={false} />
</section>

<style>
	/* * {
		outline: 1px solid hotpink;
	} */
	section {
		display: flex;
		flex-direction: column;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
		padding: 0.5rem;
		/* border: 2px solid var(--accentFaded); */
	}
	label {
		width: 100%;
		text-align: right;
		display: grid;
		grid-template-columns: 10ch 1fr;
		gap: 1rem;
	}
	textarea {
		width: 100%;
	}
	input {
		width: 100%;
	}
	button {
		width: 33%;
	}
	a {
		color: var(--accentFaded);
		text-decoration: none;
	}
	a:hover {
		color: var(--accentHover);
	}
</style>
