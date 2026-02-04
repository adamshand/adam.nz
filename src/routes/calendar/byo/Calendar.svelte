<script lang="ts">
	type SeasonName = 'autumn' | 'shitsville' | 'spring' | 'summer' | 'winter'
	type SeasonRun = {
		season: SeasonName
		start: number
		end: number
		label: string
		path: string
		fontFamily: string
	}
	type MonthLabel = {
		label: string
		x: number
		y: number
		rotation: number
	}

	let {
		location = 'Wellington',
		segments,
	}: {
		location?: string
		segments: { [key: number]: SeasonName }
	} = $props()

	const seasons: Record<SeasonName, { color: string; fontFamily: string; label: string }> = {
		autumn: {
			color: '#F7A24A',
			fontFamily: '"Kaushan Script", cursive',
			label: 'Autumn',
		},
		shitsville: {
			color: '#B89373',
			fontFamily: '"Fredericka the Great", cursive',
			label: 'Shitsville',
		},
		spring: {
			color: '#A8D68F',
			fontFamily: '"Amatic SC", cursive',
			label: 'Spring',
		},
		summer: {
			color: '#FDE07A',
			fontFamily: '"Ribeye Marrow", cursive',
			label: 'Summer',
		},
		winter: {
			color: '#C6C6C6',
			fontFamily: '"Academy Engraved LET", "Academy Engraved LET Plain", serif',
			label: 'Winter',
		},
	}
	const fallbackSeason: SeasonName = 'winter'

	let r1 = 30
	let r2 = 38.5
	let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	let numSegments = 24
	let fontSize = 4.38
	let seasonFontSize = 5.4
	const textRadius = (r1 + r2) / 2
	const seasonTextRadius = textRadius - seasonFontSize * 0.35
	const fullCircle = 2 * Math.PI
	const rotationOffset = Math.PI / 2
	const dividerColor = 'var(--dark)'
	const monthLabelRadius = 41.5
	const monthDotRadius = 41.5
	const monthDotSize = 0.32
	const monthLabelRotationDeg = 90
	const seasonRotationDays = 21 - 365 / numSegments
	const seasonRotationRadians = (seasonRotationDays / 365) * fullCircle

	function getPath(startAngle: number, endAngle: number): string {
		return `M 50 50 L ${50 + r2 * Math.cos(startAngle)} ${
			50 + r2 * Math.sin(startAngle)
		} A ${r2} ${r2} 0 0 1 ${50 + r2 * Math.cos(endAngle)} ${50 + r2 * Math.sin(endAngle)} L 50 50`
	}

	const shapes = $derived.by(() =>
		Array.from({ length: numSegments }, (_, i) => {
			let startSegmentFraction = i / numSegments // This is the fraction of the circle that the start of each segment represents
			let startAngle = startSegmentFraction * fullCircle - rotationOffset + seasonRotationRadians
			let endSegmentFraction = (i + 1) / numSegments // This is the fraction of the circle that the end of each segment represents
			let endAngle = endSegmentFraction * fullCircle - rotationOffset + seasonRotationRadians
			let season = segments[i] ?? fallbackSeason
			let color = seasons[season]?.color ?? seasons[fallbackSeason].color
			return {
				color,
				d: getPath(startAngle, endAngle),
				season: season,
			}
		}),
	)

	function getArcPath(startAngle: number, endAngle: number, radius: number): string {
		let adjustedEndAngle = endAngle
		if (adjustedEndAngle <= startAngle) {
			adjustedEndAngle += fullCircle
		}
		let largeArc = adjustedEndAngle - startAngle > Math.PI ? 1 : 0
		let x1 = 50 + radius * Math.cos(startAngle)
		let y1 = 50 + radius * Math.sin(startAngle)
		let x2 = 50 + radius * Math.cos(adjustedEndAngle)
		let y2 = 50 + radius * Math.sin(adjustedEndAngle)
		return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`
	}

	const seasonRuns: SeasonRun[] = $derived.by(() => {
		if (!segments) return []

		const runs: Array<{ season: SeasonName; start: number; end: number; label?: string }> = []
		let current = segments[0] ?? fallbackSeason
		let start = 0

		for (let i = 1; i <= numSegments; i += 1) {
			let season = i < numSegments ? (segments[i] ?? fallbackSeason) : current
			if (i === numSegments || season !== current) {
				runs.push({ season: current, start, end: i })
				current = season
				start = i
			}
		}

		if (runs.length > 1 && runs[0].season === runs[runs.length - 1].season) {
			runs[0].start = runs[runs.length - 1].start
			runs.pop()
		}

		const seasonCounts: Record<SeasonName, number> = {
			autumn: 0,
			shitsville: 0,
			spring: 0,
			summer: 0,
			winter: 0,
		}
		for (const run of runs) {
			seasonCounts[run.season] += 1
		}

		const orderedForNumbering = [...runs].sort((a, b) => a.start - b.start)
		const seasonIndex: Record<SeasonName, number> = {
			autumn: 0,
			shitsville: 0,
			spring: 0,
			summer: 0,
			winter: 0,
		}

		for (const run of orderedForNumbering) {
			const baseLabel = seasons[run.season].label
			if (seasonCounts[run.season] > 1) {
				seasonIndex[run.season] += 1
				run.label = `${baseLabel} ${seasonIndex[run.season]}`
			} else {
				run.label = baseLabel
			}
		}

		return runs.map((run) => {
			let startAngle = (run.start / numSegments) * fullCircle - rotationOffset + seasonRotationRadians
			let endAngle = (run.end / numSegments) * fullCircle - rotationOffset + seasonRotationRadians
			let path = getArcPath(startAngle, endAngle, seasonTextRadius)
			return {
				season: run.season,
				start: run.start,
				end: run.end,
				label: run.label ?? seasons[run.season].label,
				path,
				fontFamily: seasons[run.season].fontFamily,
			}
		})
	})

	const monthLabels: MonthLabel[] = $derived.by(() =>
		months.map((month, i) => {
			const angle = ((i + 0.5) / 12) * fullCircle - rotationOffset
			return {
				label: month,
				x: 50 + monthLabelRadius * Math.cos(angle),
				y: 50 + monthLabelRadius * Math.sin(angle),
				rotation: (angle * 180) / Math.PI + monthLabelRotationDeg,
			}
		}),
	)

	const monthDots = $derived.by(() =>
		months.map((_, i) => {
			const angle = (i / 12) * fullCircle - rotationOffset
			return {
				x: 50 + monthDotRadius * Math.cos(angle),
				y: 50 + monthDotRadius * Math.sin(angle),
			}
		}),
	)

	const seasonDividers = $derived.by(() =>
		seasonRuns.map((run) => {
			const angle = (run.start / numSegments) * fullCircle - rotationOffset + seasonRotationRadians
			return {
				x1: 50 + r1 * Math.cos(angle),
				y1: 50 + r1 * Math.sin(angle),
				x2: 50 + r2 * Math.cos(angle),
				y2: 50 + r2 * Math.sin(angle),
			}
		}),
	)

	let todayArrowTipRadius = r1 - 1.6
	let todayArrowLength = 3.2
	let todayArrowHalfWidth = 1.4

	const todayArrowScale = 1.5
	todayArrowLength *= todayArrowScale
	todayArrowHalfWidth *= todayArrowScale

	let now = new Date()
	let start = new Date(now.getFullYear(), 0, 0)
	let diff =
		now.getTime() -
		start.getTime() +
		(start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000
	let oneDay = 1000 * 60 * 60 * 24
	let dayOfYear = Math.floor(diff / oneDay)
	let angle = (dayOfYear / 365) * 2 * Math.PI - Math.PI / 2

	let arrowBaseRadius = todayArrowTipRadius - todayArrowLength
	let arrowTipX = 50 + todayArrowTipRadius * Math.cos(angle)
	let arrowTipY = 50 + todayArrowTipRadius * Math.sin(angle)
	let arrowBaseX = 50 + arrowBaseRadius * Math.cos(angle)
	let arrowBaseY = 50 + arrowBaseRadius * Math.sin(angle)
	let arrowPerpX = -Math.sin(angle) * todayArrowHalfWidth
	let arrowPerpY = Math.cos(angle) * todayArrowHalfWidth
	let todayArrowPoints = `${arrowBaseX + arrowPerpX},${arrowBaseY + arrowPerpY} ${
		arrowBaseX - arrowPerpX
	},${arrowBaseY - arrowPerpY} ${arrowTipX},${arrowTipY}`

	let todaySegmentIndex = Math.floor((dayOfYear / 365) * numSegments) % numSegments
	let todaySeason = segments[todaySegmentIndex] ?? fallbackSeason
	let todayArrowColor = seasons[todaySeason]?.color ?? seasons[fallbackSeason].color
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com" rel="preconnect" />
	<link href="https://fonts.gstatic.com" rel="preconnect" />
	<link
		href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Fredericka+the+Great&family=Kaushan+Script&family=Ribeye+Marrow"
		rel="stylesheet"
	/>
</svelte:head>

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

	{#each seasonDividers as divider, i (i)}
		<line
			x1={divider.x1}
			y1={divider.y1}
			x2={divider.x2}
			y2={divider.y2}
			stroke={dividerColor}
			stroke-width="0.35"
		/>
	{/each}

	<circle cx="50" cy="50" fill="transparent" r={r1} stroke="transparent" stroke-width="0.25" />

	<polygon fill={todayArrowColor} points={todayArrowPoints} />

	{#each monthLabels as month, i (month.label)}
		<text
			fill="white"
			font-size={fontSize}
			font-weight="200"
			text-anchor="middle"
			dominant-baseline="middle"
			transform={`rotate(${month.rotation} ${month.x} ${month.y})`}
			x={month.x}
			y={month.y}
		>
			{month.label}
		</text>
	{/each}

	{#each monthDots as dot, i (i)}
		<circle cx={dot.x} cy={dot.y} fill="white" r={monthDotSize} />
	{/each}

	{#each seasonRuns as run, i (i)}
		<text
			fill="hsl(0deg 0% 15%)"
			font-family={run.fontFamily}
			font-size={seasonFontSize}
			font-weight="400"
			text-anchor="middle"
		>
			<textPath href={`#season-path-${i}`} startOffset="50%">{run.label}</textPath>
		</text>
	{/each}

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
		{#each seasonRuns as run, i (i)}
			<path d={run.path} id={`season-path-${i}`} />
		{/each}
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
