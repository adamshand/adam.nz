import type { Actions } from './$types'

import { stripe, type CartItem } from '.'
import { env } from '$env/dynamic/private'

export const load = async () => {}

export const actions: Actions = {
	default: async ({ request }) => {
		const form = await request.formData()
		const cart = JSON.parse(form.get('cart') as string)
		const email = form.get('email') as string
		const orderId = form.get('orderId') as string

		const stripeItems = cart.map((item: CartItem) => {
			return {
				price_data: {
					currency: 'NZD',
					product_data: {
						name: item.name,
						images: [],
					},
					unit_amount: item.price * 100,
				},
				quantity: item.quantity,
			}
		})

		console.log(JSON.stringify(stripeItems, null, 2))

		const session = await stripe.checkout.sessions.create({
			line_items: stripeItems,
			shipping_address_collection: {
				allowed_countries: ['NZ', 'US', 'AU'],
			},
			mode: 'payment',
			cancel_url: `${env.STRIPE_BASE}?id=${orderId}&success=false`,
			success_url: `${env.STRIPE_BASE}?id=${orderId}&success=true`,
			phone_number_collection: {
				enabled: true,
			},
			client_reference_id: orderId,
			customer_email: email,
			//custom_fields: [] // https://docs.stripe.com/api/checkout/sessions/object#checkout_session_object-custom_fields
			//custom_text: {} // https://docs.stripe.com/api/checkout/sessions/object#checkout_session_object-custom_text
		})

		console.log('session:', session)
		return { url: session.url }
	},
}
