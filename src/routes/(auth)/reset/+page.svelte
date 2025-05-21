<script lang="ts">
	import { enhance } from '$app/forms'
	import { page } from '$app/state'
	import { isValidEmail } from '$lib/index'

	let isLoading = $state(false)
	let email = $state('')
	let disabled = $derived(!isValidEmail(email))
</script>

<h3>Password reset</h3>

{#if page.form?.success}
	<p class="success">
		A recovery message has been sent to <mark>{page.form?.email}</mark>. Please check your spam
		folder if it doesn't show up.
	</p>
{:else}
	<p>
		Enter the email associated with your account, and we'll send you a link you can use to reset
		your password.
	</p>

	<form
		method="POST"
		use:enhance={async () => {
			isLoading = true
			await new Promise((resolve) => setTimeout(resolve, 1500)) // give loading spinner time
			isLoading = false
		}}
	>
		<fieldset>
			<label
				>Email
				<input
					autocomplete="email"
					bind:value={email}
					id="email"
					name="email"
					placeholder="adam@example.nz"
					required
					type="email"
				/></label
			>
			<button aria-busy={isLoading} {disabled} type="submit">Send Recovery Email</button>
		</fieldset>
	</form>
{/if}
<small>Remembered? <a href="/sign/in">Sign in to your account</a>.</small>

<style>
	p.success {
		padding: 1cap;
		/* background-color: var(--pico-blockquote-border-color); */
		text-align: center;
	}
	button {
		width: 100%;
	}
	small {
		display: inline-block;
		width: 100%;
		text-align: center;
	}
	fieldset {
		padding: 1rem;
	}

	fieldset,
	label {
		display: grid;
		gap: 0.5rem;
	}
	/* See also: https://www.youtube.com/watch?v=awNYtIAu6pI */
	input:user-valid {
		border-color: green;
	}
	input:user-invalid {
		border-color: red;
	}
	input:focus-invalid {
		border-color: yellow;
	}
</style>
