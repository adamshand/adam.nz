<script lang="ts">
	import type { CommentType } from '$lib/types'

	import { enhance } from '$app/forms'

	import Show from '$lib/components/comments/Show.svelte'

	let { comment, location, title }: { comment: string; location: string; title: string } = $props()

	async function sha256(message: string) {
		const msgBuffer = new TextEncoder().encode(message)
		const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
		const hashArray = Array.from(new Uint8Array(hashBuffer))
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
		return hashHex
	}

	let email = $state('')
	let homepage = $state('')
	let name = $state('')
	let gravatar = $state('')

	// const gravatar = $derived.by(async () => {
	// 	return await sha256(email.trim().toLowerCase())
	// })

	// FIXME: This works but is supposedly bad and doesn't work reliably.
	$effect(() => {
		;(async () => {
			gravatar = await sha256(email)
		})()
	})

	let preview = $derived({
		created: new Date().toString(),
		homepage,
		gravatar,
		name,
		text: comment,
	}) as CommentType

	// $inspect('comment/Preview.svelte:', preview, gravatar)
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
			<input
				bind:value={name}
				name="name"
				placeholder="required"
				required
				type="text"
				minlength="3"
				maxlength="32"
			/>
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
