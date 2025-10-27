<script lang="ts">
	interface Invoice {
		id: number
		paid_at: string
		amount: number
		tax_amount: number
		currency: string
		client: {
			id: number
			name: string
		}
		state: string
	}

	let { data }: { data: { taxYear: string; invoices: { [key: string]: Invoice[] } } } = $props()
</script>

<h1>GST {data.taxYear}</h1>

{#each Object.keys(data.invoices) as period}
	{@const totalEarnings = data.invoices[period]
		.reduce((sum: number, inv: any) => sum + inv.amount, 0)
		.toFixed(2)}
	{@const totalGST = data.invoices[period]
		.reduce((sum: number, inv: any) => sum + inv.tax_amount, 0)
		.toFixed(2)}
	{@const zeroRated = data.invoices[period]
		.filter((inv: any) => inv.tax_amount === 0)
		.reduce((sum: number, inv: any) => sum + inv.amount, 0)
		.toFixed(2)}

	<h2>
		{#if period === 'aprToSep'}
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
				<th align="right">Total <br />(inc GST)</th>
				<th align="right">GST</th>
				<th>💰</th>
			</tr>
		</thead>
		<tbody>
			{#each data.invoices[period] as invoice}
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
					<td align="right">{invoice.currency}${invoice.amount.toFixed(2)}</td>
					<td align="right">${invoice.tax_amount.toFixed(2)}</td>
					<td>{invoice.state ? '✅' : '❌'}</td>
				</tr>
			{/each}
		</tbody>
		<tfoot>
			<tr>
				<td colspan="2" align="right"> Earnings (inc GST): </td>
				<td align="right"> ${totalEarnings} </td>
				<td align="right"> ${totalGST} </td>
				<td>💰</td>
			</tr>
			<tr>
				<td colspan="2" align="right"> Earnings (ex GST): </td>
				<td align="right"> ${(+totalEarnings - +totalGST).toFixed(2)}</td>
				<td align="right"> </td>
				<td></td>
			</tr>
			<tr>
				<td colspan="2" align="right"> Zero Rated : </td>
				<td align="right"> ${zeroRated}</td>
				<td align="right"> </td>
				<td></td>
			</tr></tfoot
		>
	</table>
{/each}

<style>
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
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 3rem;
	}

	thead {
		border-bottom: 3px solid var(--dark);
	}
	tfoot {
		border-top: 3px solid var(--dark);

		td {
			font-weight: bold;
		}
	}
	th,
	td {
		padding: 0.5rem;
		vertical-align: top;
	}
	th {
		vertical-align: bottom;
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
