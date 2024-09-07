<script lang="ts">
	import { enhance } from '$app/forms'

	let { comment }: { comment: string } = $props()
</script>

<section>
	<h2>Confirm your comment?</h2>

	<form action="?/submitComment" method="POST" use:enhance>
		<textarea
			maxlength="2048"
			minlength="5"
			name="comment"
			rows="15"
			spellcheck="true"
			value={comment}
		></textarea>

		<div>
			<label>
				Name:
				<input name="name" placeholder="required" required type="text" />
			</label>
		</div>
		<div>
			<label>
				Email:
				<input name="email" placeholder="required" required type="email" />
			</label>
		</div>
		<!-- <div>
			<label>
				Website:
				<input name="website" type="website" placeholder="optional" />
			</label>
		</div> -->
		<button value="Submit">Send</button>
	</form>
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 0.5rem;
		width: 43ch;
		padding: 0.5rem;
		border: 3px solid var(--accentFaded);
	}
	textarea {
		width: 100%;
	}
	button {
		width: 25%;
	}
</style>
