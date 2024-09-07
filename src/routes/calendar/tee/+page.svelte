<script lang="ts">
	import { browser } from '$app/environment'
	import { enhance } from '$app/forms'
	import Countdown from '$lib/components/Countdown.svelte'

	// export let data
	// export let form: { url?: string }
	let { form } = $props()

	let sending = $state(false)
	let shirtColor = $state('light')
	let seasonName = $state('shitsville')

	const calendarImage = $derived(`/calendar/512x512/calendar-${seasonName}-${shirtColor}.png`)
	// $: calendarImage = `/calendar/512x512/calendar-${seasonName}-${shirtColor}.png`
	// $: productImage = data.shirts[shirtColor].mockupUrl

	if (browser && form?.url) {
		window.location.href = form.url
	}
</script>

<main>
	{#if sending}
		<div
			class="mockups"
			style={`margin-top: 0; background-color: ${
				shirtColor === 'light' ? 'bisque' : 'var(--darkContrast)'
			}`}
		>
			<img alt="Tshirt mockup" src={calendarImage} />
		</div>
		<div class="description">
			<h1>Thanks!</h1>
			<p>
				Please bear with us as the the store prepares your order for purchase. You will be
				redirected to the shop shortly!
			</p>
			<div>
				<span style="font-size: 1.5rem;">Ready in <Countdown countdown={30} /> seconds ...</span>
			</div>
		</div>
	{:else}
		<div
			class="mockups"
			style={`background-color: ${shirtColor === 'light' ? 'bisque' : 'var(--darkContrast)'}`}
		>
			<img alt={'Mockup of ' + shirtColor + ' tshirt'} src={calendarImage} />
		</div>

		<div class="description">
			<h1>A Realistic Calendar</h1>
			<p>
				You were on <a href="https://twitter.com/adamshand/status/513197000930521089">Twitter</a>,
				back in the dark ages of 2014, before the
				<a href="/realistic-calendar"> Realistic Calendar</a>
				was cool. Before <i>Shitsville</i> was de rigueur.
			</p>
			<p>
				Commemorate your participation in an original Wellington meme with with your very own
				Shitsville shirt.
			</p>
			<p>
				Do you prefer less spice in your seasons? If so, I suggest the kiddo friendly (but equally
				accurate) <i>False Hope</i> version.
			</p>
			<form
				method="POST"
				target="_blank"
				use:enhance={() => {
					sending = true
				}}
			>
				<div class="btn-group">
					<h3>Spice Level</h3>
					<input
						checked
						id="shitsville"
						name="seasonName"
						onchange={() => (seasonName = 'shitsville')}
						type="radio"
						value="shitsville"
					/>
					<label for="shitsville">Shitsville</label>
					<input
						id="falsehope"
						name="seasonName"
						onchange={() => (seasonName = 'falsehope')}
						type="radio"
						value="falsehope"
					/>
					<label for="falsehope">False Hope</label>
				</div>

				<div class="btn-group">
					<h3>Shirt Colours</h3>
					<input
						checked
						id="light"
						name="shirtColor"
						onchange={() => (shirtColor = 'light')}
						type="radio"
						value="light"
					/>
					<label for="light">Light</label>
					<input
						id="dark"
						name="shirtColor"
						onchange={() => (shirtColor = 'dark')}
						type="radio"
						value="dark"
					/>
					<label for="dark">Dark</label>
				</div>

				<button>Order</button>
			</form>
		</div>
	{/if}
</main>

<style>
	main {
		display: flex;
		flex-wrap: wrap;
		align-items: flex-start;
		gap: 0.5rem;
	}
	.mockups {
		flex: 1;
		order: 1;
		max-width: 60%;
		margin-top: 4rem;
		padding: 1rem;
		background-color: var(--darkContrast);
	}
	.description {
		flex: 1;
		order: 2;
		padding: 1rem;
	}
	/* .price {
		font-size: 1.2rem;
		font-weight: 400;
	} */
	img {
		max-width: 100%;
	}

	form {
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		align-items: flex-start;
		gap: 1rem;
	}
	.btn-group input[type='radio'] {
		display: none;
	}
	button,
	.btn-group label {
		display: inline-block;
		width: 8rem;
		padding: 0.5rem 0.5rem;
	}

	.btn-group label {
		margin-right: 0.5rem;
		background-color: var(--darkContrast);
		transition: all 0.3s ease;
		border-radius: 11px;
		color: var(--lightFaded);
		cursor: pointer;
		font-weight: 600;
		text-align: center;
	}
	.btn-group label:hover {
		background-color: var(--accentHover);
		color: var(--dark);
	}
	.btn-group input[type='radio']:checked + label {
		background-color: var(--accent);
		color: var(--dark);
		cursor: auto;
	}
</style>
