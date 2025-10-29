<script lang="ts">
	import { type Invoice, calculateTax } from '.'
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
			taxYear: string
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

	const periodDetails = data.invoices.reduce<Record<number, PeriodTotals>>((acc, inv) => {
		const period = inv.gstPeriod

		acc[period] ??= { amount: 0, tax_amount: 0, amountWithoutGst: 0, zeroRated: 0 }

		const amount = Number(inv.amount) || 0
		const tax = Number(inv.tax_amount) || 0
		const net = Number(inv.amountWithoutGst) || 0

		acc[period].amount += amount
		acc[period].tax_amount += tax
		acc[period].amountWithoutGst += net

		// zero-rated if tax is effectively zero
		if (Math.abs(tax) < 1e-9) acc[period].zeroRated += amount

		return acc
	}, {})

	// $inspect(periodDetails)
</script>

<h1>Income & Tax {data.taxYear}</h1>

<section>
	<Details amount={data.yearly.revenue} title={'Revenue'} description="including GST" />
	<Details amount={data.yearly.income} title={'Income'} description="excluding GST" />
	<Details
		amount={data.yearly.tax}
		title={'Income Tax'}
		description={'estimated ' + data.yearly.taxRate}
	/>
	<Details amount={data.yearly.gst} title={'GST'} description="15%" />
</section>

{#each gstPeriods as period}
	<h2>
		{#if period === 0}
			1 April - 31 September
		{:else}
			1 October - 31 March
		{/if}
	</h2>

	<table>
		<thead>
			<tr>
				<th align="left">Paid At</th>
				<th align="left">Client</th>
				<th align="right">Income</th>
				<th align="right">GST</th>
				<th align="right">Total</th>
				<th>💰</th>
			</tr>
		</thead>

		<tbody>
			{#each data.invoices as invoice}
				{#if invoice.gstPeriod === period}
					<tr>
						<td>
							<a
								href={'https://haume.harvestapp.com/invoices/' + invoice.id}
								target="_blank"
								rel="noopener noreferrer"
							>
								{invoice.paid_at.split('T')[0]}
							</a>
						</td>
						<td>
							<a href={`https://haume.harvestapp.com/clients/${invoice.client.id}`}>
								{invoice.client.name}</a
							>
						</td>
						<td align="right">${invoice.amountWithoutGst}</td>
						<td align="right">${invoice.tax_amount}</td>
						<td class:warning={invoice.state !== 'paid'} align="right">
							${invoice.amount}
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
		<Details amount={periodDetails[period].amount} title="Revenue" description="including GST" />
		<Details
			amount={periodDetails[period].amountWithoutGst}
			title="Income"
			description="excluding GST"
		/>
		<Details amount={periodDetails[period].tax_amount} title="GST" description="GST" />
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
	a {
		text-decoration: none;

		&:hover {
			text-decoration: underline;
		}
	}
	table {
		max-width: 100%;
		border-collapse: collapse;
		margin-bottom: 1rem;
		font-size: smaller;
	}

	thead {
		border-bottom: 3px solid var(--dark);
	}
	th,
	td {
		padding: 0.5rem;
		vertical-align: top;
	}
	th {
		vertical-align: bottom;
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
