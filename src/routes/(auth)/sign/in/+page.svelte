<script lang="ts">
	import { enhance } from '$app/forms'

	let username = $state('')
	let password = $state('')
	let disabled = $derived(!username || !password)
</script>

<h3>Sign in to your account</h3>

<form method="POST" use:enhance>
	<fieldset>
		<label
			>Email
			<!-- svelte-ignore a11y_autofocus -->
			<input
				autofocus
				autocomplete="email"
				bind:value={username}
				name="username"
				required
				type="email"
			/></label
		>

		<label
			>Password
			<input
				autocomplete="on"
				bind:value={password}
				name="password"
				required
				type="password"
			/></label
		>

		<!-- <button {disabled} type="submit">Sign in</button> -->
		<button type="submit">Sign in</button>

		<p>Not a member? <a href="/sign/up">Sign up for an account</a>.</p>
	</fieldset>
</form>

<style>
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
