<script lang="ts">
	let { data } = $props()
	$inspect(data)
	// const octoberFirst = `${data.taxYear}1001`
</script>

<h1 style="text-align: center">GST {data.taxYear}</h1>

{#each Object.keys(data.invoices) as period}
	<h2>
		{#if period === 'aprToSep'}
			1 April - 31 September
		{:else}
			1 October - 31 March
		{/if}
	</h2>
	<table>
		<tbody>
			<tr>
				<th align="left">Paid</th>
				<th align="left">Client</th>
				<th align="right">Total</th>
				<th align="right">Tax</th>
				<th>💰</th>
			</tr>
			{#each data.invoices[period] as invoice}
				<tr>
					<td>{invoice.paid_at.split('T')[0]}</td>
					<td>{invoice.client.name}</td>
					<td align="right">${invoice.amount.toFixed(2)}</td>
					<td align="right">${invoice.tax_amount.toFixed(2)}</td>
					<td>{invoice.state ? '✅' : '❌'}</td>
				</tr>
			{/each}
		</tbody>
	</table>
{/each}

<style>
	table {
		width: 100%;
		border-collapse: collapse;
		margin-bottom: 2rem;
	}

	td {
		border: 1px solid #ddd;
		padding: 0.5rem;
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
