<script lang="ts">
	// import type { SegmentsType } from '$lib/types'

	let {
		location = 'Wellington',
		segments,
	}: {
		location?: string
		segments: { [key: number]: 'autumn' | 'shitsville' | 'spring' | 'summer' | 'winter' }
	} = $props()

	// export let location = 'Wellington'
	// export let segments: SegmentsType[]
	// export let segments: { [key: number]: 'autumn' | 'shitsville' | 'spring' | 'summer' | 'winter' }
	// export let segments: { [key: number]: string }

	let seasons = {
		autumn: { color: 'hsl(18deg 90% 57%)' },
		shitsville: { color: 'hsl(30deg 42% 49%)' },
		spring: { color: 'hsl(92deg 48% 54%)' },
		summer: { color: 'hsl(58deg 100% 66%)' },
		winter: { color: 'hsl(0deg 0% 75%)' },
	}
	// console.log(segments, seasons)

	let r1 = 30
	let r2 = 38.5
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	let numSegments = 24
	let fontSize = 4.38

	function getPath(startAngle: number, endAngle: number): string {
		return `M 50 50 L ${50 + r2 * Math.cos(startAngle)} ${
			50 + r2 * Math.sin(startAngle)
		} A ${r2} ${r2} 0 0 1 ${50 + r2 * Math.cos(endAngle)} ${50 + r2 * Math.sin(endAngle)} L 50 50`
	}

	let shapes = Array.from({ length: numSegments }, (_, i) => {
		let rotationOffset = Math.PI / 2 // This is the rotation offset to start at 12 o'clock
		let fullCircle = 2 * Math.PI // This represents a full circle in radians
		let startSegmentFraction = i / numSegments // This is the fraction of the circle that the start of each segment represents
		let startAngle = startSegmentFraction * fullCircle - rotationOffset
		let endSegmentFraction = (i + 1) / numSegments // This is the fraction of the circle that the end of each segment represents
		let endAngle = endSegmentFraction * fullCircle - rotationOffset
		let season = segments[i]
		return {
			color: seasons[season].color,
			d: getPath(startAngle, endAngle),
			season: season,
		}
	})

	let todayArrow = r1 - 4 // Adjust this value as needed

	let now = new Date()
	let start = new Date(now.getFullYear(), 0, 0)
	let diff =
		now.getTime() -
		start.getTime() +
		(start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000
	let oneDay = 1000 * 60 * 60 * 24
	let dayOfYear = Math.floor(diff / oneDay)
	let angle = (dayOfYear / 365) * 2 * Math.PI - Math.PI / 2
</script>

<svg height="100%" viewBox="0 0 100 100" width="100%">
	{#each shapes as shape, i (i)}
		<path d={shape.d} fill={shape.color} mask="url(#donut-mask)" />
		<!-- {#if i % 2 === 0}
			<line
				x1={50 + r1 * Math.cos((i / numSegments) * 2 * Math.PI - Math.PI / 2)}
				y1={50 + r1 * Math.sin((i / numSegments) * 2 * Math.PI - Math.PI / 2)}
				x2={50 + r2 * Math.cos((i / numSegments) * 2 * Math.PI - Math.PI / 2)}
				y2={50 + r2 * Math.sin((i / numSegments) * 2 * Math.PI - Math.PI / 2)}
				stroke="black"
				stroke-width=".3"
			/>
		{/if} -->
	{/each}

	<circle cx="50" cy="50" fill="transparent" r={r1} stroke="transparent" stroke-width="0.25" />

	<line
		marker-end="url(#arrow)"
		stroke="transparent"
		stroke-width=".5"
		x1="50"
		x2={50 + todayArrow * Math.cos(angle)}
		y1="50"
		y2={50 + todayArrow * Math.sin(angle)}
	/>

	<text fill="white" font-size={fontSize} font-weight="200">
		<textPath href="#textPath" startOffset="0%">
			{#each months as month}
				<!-- \u00A0 is JS for &nbsp; because vscode was collapsing multiple spaces -->
				{'\u00A0\u00A0\u00A0\u00A0\u00A0' + month + '\u00A0\u00A0\u00A0\u00A0\u00A0'}
			{/each}
		</textPath>
	</text>

	<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="60"
		>A Realistic</text
	>
	<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="65"
		>{location}</text
	>
	<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="70"
		>Calendar</text
	>

	<defs>
		<path d="M50,50 m0,-40 a40,40 0 1,1 0,80 a40,40 0 1,1 0,-80" id="textPath" />
	</defs>

	<defs>
		<marker
			id="arrow"
			markerHeight="6"
			markerUnits="strokeWidth"
			markerWidth="6"
			orient="auto"
			refX="0"
			refY="3"
		>
			<path d="M0,0 L0,4 L6,2 z" fill="white" />
		</marker>
	</defs>

	<defs>
		<mask id="donut-mask">
			<rect fill="white" height="100%" width="100%" />
			<circle cx="50" cy="50" fill="black" r={r1} />
		</mask>
	</defs>
</svg>

<style>
</style>
