<script lang="ts">
	import { type Invoice } from '.'
	import Details from './Details.svelte'

	type PeriodTotals = {
		amount: number
		tax_amount: number
		amountWithoutGst: number
		zeroRated: number
	}

	type Props = {
		data: {
			invoices: Invoice[]
			gstAdjustments: {
				taxYear: number
				gstPeriod: number
				amount: number
				description: string
			}[]
			taxYear: number
			taxYearLabel: string
			taxYears: { year: number; label: string }[]
			yearly: {
				gst: number
				income: number
				revenue: number
				tax: number
				taxRate: string
			}
		}
	}

	let { data }: Props = $props()

	const gstPeriods = [0, 1]

	const emptyPeriodTotals = (): PeriodTotals => ({
		amount: 0,
		tax_amount: 0,
		amountWithoutGst: 0,
		zeroRated: 0,
	})

	const periodDetails = $derived.by(() => {
		const totals = data.invoices.reduce<Record<number, PeriodTotals>>(
			(acc, inv) => {
				const period = inv.gstPeriod

				acc[period] ??= emptyPeriodTotals()

				const amount = Number(inv.amount) || 0
				const tax = Number(inv.tax_amount) || 0
				const net = Number(inv.amountWithoutGst) || 0

				acc[period].amount += amount
				acc[period].tax_amount += tax
				acc[period].amountWithoutGst += net

				// Treat only fully no-GST invoices as zero-rated for this one-off filing report.
				if (Math.abs(tax) < 1e-9) acc[period].zeroRated += amount

				return acc
			},
			{
				0: emptyPeriodTotals(),
				1: emptyPeriodTotals(),
			},
		)

		for (const adjustment of data.gstAdjustments) {
			totals[adjustment.gstPeriod] ??= emptyPeriodTotals()
			totals[adjustment.gstPeriod].tax_amount += adjustment.amount
			totals[adjustment.gstPeriod].amountWithoutGst -= adjustment.amount
		}

		return totals
	})
</script>

<h1>Income & Tax {data.taxYearLabel}</h1>

<form class="tax-year-picker" method="GET">
	<label for="tax-year">Financial year</label>
	<select id="tax-year" name="year" onchange={(event) => event.currentTarget.form?.requestSubmit()}>
		{#each data.taxYears as taxYearOption (taxYearOption.year)}
			<option value={taxYearOption.year} selected={taxYearOption.year === data.taxYear}>
				{taxYearOption.label}
			</option>
		{/each}
	</select>
	<button type="submit">View</button>
</form>

<section>
	<Details amount={data.yearly.revenue} title="Invoiced" description="including GST" />
	<Details amount={data.yearly.income} title="Income" description="excluding GST" />
	<Details
		amount={data.yearly.tax}
		title="Income Tax"
		description={`estimated ${data.yearly.taxRate}`}
	/>
	<Details amount={data.yearly.gst} title="GST" description="15% incl. adjustments" />
</section>

{#if data.gstAdjustments.length > 0}
	<div class="adjustments">
		<strong>GST adjustments applied:</strong>
		<ul>
			{#each data.gstAdjustments as adjustment (`${adjustment.taxYear}-${adjustment.gstPeriod}-${adjustment.amount}`)}
				<li>{adjustment.description}: ${adjustment.amount.toFixed(2)}</li>
			{/each}
		</ul>
	</div>
{/if}

{#each gstPeriods as period (period)}
	<h2>
		{#if period === 0}
			1 April - 30 September
		{:else}
			1 October - 31 March
		{/if}
	</h2>

	<table>
		<thead>
			<tr>
				<th align="left">Paid Date</th>
				<th align="left">Client</th>
				<th align="right">Income</th>
				<th align="right">GST</th>
				<th align="right">Total</th>
				<th>💰</th>
			</tr>
		</thead>

		<tbody>
			{#each data.invoices as invoice (invoice.id)}
				{#if invoice.gstPeriod === period}
					<tr>
						<td>
							<a
								href={'https://haume.harvestapp.com/invoices/' + invoice.id}
								target="_blank"
								rel="noopener noreferrer"
							>
								{invoice.paid_date}
							</a>
						</td>
						<td>
							<a href={`https://haume.harvestapp.com/clients/${invoice.client.id}`}>
								{invoice.client.name}</a
							>
						</td>
						<td align="right">${invoice.amountWithoutGst.toFixed(2)}</td>
						<td align="right">${invoice.tax_amount.toFixed(2)}</td>
						<td class:warning={invoice.state !== 'paid'} align="right">
							${invoice.amount.toFixed(2)}
						</td>
						<td class:warning={invoice.currency !== 'NZD'} align="center">
							{invoice.currency}
						</td>
					</tr>
				{/if}
			{/each}
		</tbody>
	</table>

	<section>
		<Details amount={periodDetails[period].amount} title="Invoiced" description="including GST" />
		<Details
			amount={periodDetails[period].amountWithoutGst}
			title="Income"
			description="excluding GST"
		/>
		<Details amount={periodDetails[period].tax_amount} title="GST" description="15%" />
		<Details amount={periodDetails[period].zeroRated} title="Zero Rated" description="no GST" />
	</section>
{/each}

<style>
	.warning {
		color: red;
		font-weight: 600;
	}
	h1,
	h2 {
		margin-top: 2rem;
		margin-bottom: 1rem;
		text-align: center;
	}
	.tax-year-picker {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}
	.tax-year-picker label {
		font-weight: 600;
	}
	.tax-year-picker select,
	.tax-year-picker button {
		padding: 0.35rem 0.6rem;
		border: 1px solid var(--lightFaded);
		border-radius: 0.35rem;
		background: var(--dark);
		color: var(--light);
	}
	.adjustments {
		margin: 1rem auto;
		max-width: 50rem;
		padding: 0.75rem 1rem;
		border: 2px solid var(--accentFaded);
		border-radius: 0.5rem;
		background: var(--dark);
	}
	.adjustments ul {
		margin-bottom: 0;
	}
	a {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
	table {
		margin-bottom: 1rem;
		max-width: 100%;
		font-size: smaller;
		border-collapse: collapse;
		border: 2px solid var(--darkContrast);

		thead {
			background-color: var(--accentFaded);
		}
		th,
		td {
			padding: 0.5rem;
			vertical-align: top;
		}
		th {
			background-color: var(--dark);
			color: var(--accentFaded);
			vertical-align: bottom;
			font-size: 1rem;
		}
	}
	section {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr 1fr;
		gap: 0.5rem;
	}

	/* 
	{
  "id": 49097684,
  "client_key": "16ea0524ff4e09932fa5248f080c91b59e03bf33",
  "number": "134",
  "purchase_order": "",
  "amount": 127.39,
  "due_amount": 0,
  "tax": 15,
  "tax_amount": 16.62,
  "tax2": null,
  "tax2_amount": 0,
  "discount": 41.7,
  "discount_amount": 79.23,
  "subject": "Prorated invoice for manawatuscottish.co.nz (1 Sep 2025 – 31 Mar 2026)",
  "notes": "For New Zealand customers please send payment to:\r\n\r\nAdam Shand\r\nKiwibank\r\n38-9002-0518402-13\r\n\r\nFor overseas customers, I accept PayPal at: adam@shand.net or credit cards upon request.\r\n\r\nMany thanks for your continued support.   ",
  "state": "paid",
  "period_start": null,
  "period_end": null,
  "issue_date": "2025-10-13",
  "due_date": "2025-10-28",
  "payment_term": "net 15",
  "sent_at": "2025-10-13T04:05:30Z",
  "paid_at": "2025-10-16T00:00:00Z",
  "closed_at": null,
  "recurring_invoice_id": null,
  "created_at": "2025-10-13T04:04:29Z",
  "updated_at": "2025-10-16T00:16:29Z",
  "paid_date": "2025-10-16",
  "currency": "NZD",
  "payment_options": [],
  "client": {
    "id": 16940334,
    "name": "Manawatu Scottish Pipe Band"
  },
  "estimate": null,
  "retainer": null,
  "creator": {
    "id": 5309941,
    "name": "Adam Shand"
  },
  "line_items": [
    {
      "id": 253983403,
      "kind": "Product",
      "description": "Website hosting: www.manawatuscottish.co.nz\r\n",
      "quantity": 1,
      "unit_price": 90,
      "amount": 90,
      "taxed": true,
      "taxed2": false,
      "project": null
    },
    {
      "id": 253983404,
      "kind": "Product",
      "description": "Admin & Software Updates ",
      "quantity": 1,
      "unit_price": 100,
      "amount": 100,
      "taxed": true,
      "taxed2": false,
      "project": null
    }
  ]
} 
 */
</style>
