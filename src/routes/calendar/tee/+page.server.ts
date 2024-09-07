import { dev } from '$app/environment'
import { error } from '@sveltejs/kit'
import fs from 'fs/promises'

const apiKey = 'iGC4P3k3aEPQ9DPe46oNl8MWetVgxiUDJlA8Ah62' // public

function setTitle(season: string, colour: string) {
	let formattedSeason
	if (season === 'shitsville') {
		formattedSeason = 'Shitsville'
	} else if (season === 'falsehope') {
		formattedSeason = 'False Hope'
	}
	const formattedColour = `${colour[0].toUpperCase() + colour.slice(1)}`
	return `${formattedSeason} Shirt (${formattedColour} Colours)`
}

function setDescription(season: string) {
	const description = `<p>You were there, back in the dark ages of 2014, before the Realistic Calendar was cool. When the internet was still innocent. Before <i>Shitsville</i> was de rigueur.</p><p>Commemorate your participation in an original Wellington meme with with your very own Shitsville shirt.</p><p>If you'd prefer something other than a tee, you can put this design on the garment of your choice down below.</p>`
	if (season === 'falsehope') {
		const extra = `<p>If you prefer less seasonal spice, there is also a kiddo friendly <i>False Hope</i> version.</p>`
		return description + extra
	}
	return description
}

async function mimeEncodeFile(filePath: string): Promise<string> {
	const fileBuffer = await fs.readFile(filePath)
	return fileBuffer.toString('base64')
}

// export const load = async () => {
// 	return {}
// }

export const actions = {
	default: async ({ fetch, request }) => {
		const data = await request.formData()
		const shirtColor = data.get('shirtColor') as string
		const seasonName = data.get('seasonName') as string
		const imagePath = `static/calendar/printable/calendar-${seasonName}-${shirtColor}.png`

		const colours = (
			shirtColor === 'light'
				? ['Oat', 'Sand', 'Mustard', 'White']
				: ['Chocolate', 'Moss Green', 'Dark Grey', 'Black']
		).join(',')

		try {
			const encodedImage = await mimeEncodeFile(imagePath)
			const options = {
				body: JSON.stringify({
					colours,
					cross_sell: true,
					description: setDescription(seasonName),
					image_url: `data:image/png;base64,${encodedImage}`,
					item_code: 'RNA1',
					name: setTitle(seasonName, shirtColor),
				}),
				headers: {
					Accept: 'application/json, text/html',
					Authorization: `Bearer ${apiKey}`,
					'Content-Type': 'application/json',
				},
				method: 'POST',
			}

			// console.log(options.body)
			// return

			const response = await fetch('https://teemill.com/omnis/v3/product/create', options)
			if (!response.ok) {
				console.error(`API request failed with status ${response.status}: ${response.statusText}`)
				const errorText = await response.text()
				console.error(`Response body: ${errorText}`)
				throw error(500, `API Error: ${response.statusText}`)
			}

			const { url } = await response.json()
			return { url }
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			console.error(err)
			throw error(500, `Server Error: ${err.body.message}`)
		}
	},
}
