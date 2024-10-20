import { building } from '$app/environment'
import { env } from '$env/dynamic/private'

import Stripe from 'stripe'

export interface Product {
	id: number
	name: string
	price: number
}

export interface CartItem extends Product {
	quantity: number
}

export let stripe: Stripe | undefined = undefined
if (!building && env.STRIPE_KEY) {
	stripe = new Stripe(env.STRIPE_KEY)
}

// export const stripe = new Stripe(env.STRIPE_KEY, {
// 	apiVersion: '2023-08-16',
// })
