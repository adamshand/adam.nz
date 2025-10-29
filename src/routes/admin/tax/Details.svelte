<script lang="ts">
	interface Props {
		amount: number | string
		title: string
		description: string
	}
	let { amount, title, description }: Props = $props()

	function formatCurrency(amount: number, currency = 'NZD', locale = 'en-NZ') {
		return new Intl.NumberFormat(locale, {
			style: 'currency',
			currency,
		}).format(amount)
	}
</script>

<section>
	<div>{title}</div>
	<h3>{formatCurrency(Number(amount))}</h3>
	<span>{description}</span>
</section>

<style>
	section {
		padding: 0.5rem;
		border: 2px solid var(--lightFaded);
		border-radius: 10px;
		background-color: var(--dark);
	}
	div {
		color: var(--light);
		font-size: 0.9rem;
		font-weight: 400;
	}
	h3 {
		margin: 1rem;
		text-align: center;
		font-size: 1.1rem;
		font-weight: 700;
		color: var(--accentHover);
	}
	span {
		display: block;
		color: var(--lightFaded);
		font-size: 0.7rem;
		font-weight: 400;
		text-align: right;
	}
</style>
