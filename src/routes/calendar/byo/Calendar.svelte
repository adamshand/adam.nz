<script lang="ts">
	import { dev } from '$app/environment'
	import { page } from '$app/state'

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

	function parseNowParam(value: string | null): Date | null {
		if (!value) return null

		let m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
		if (m) {
			const year = Number(m[1])
			const monthIndex = Number(m[2]) - 1
			const day = Number(m[3])
			const date = new Date(year, monthIndex, day)
			if (date.getFullYear() === year && date.getMonth() === monthIndex && date.getDate() === day) {
				return date
			}
			return null
		}

		m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(value)
		if (m) {
			const year = Number(m[1])
			const monthIndex = Number(m[2]) - 1
			const day = Number(m[3])
			const hours = Number(m[4])
			const minutes = Number(m[5])
			const seconds = m[6] ? Number(m[6]) : 0
			const msRaw = m[7]
			const milliseconds =
				msRaw == null
					? 0
					: msRaw.length === 1
						? Number(msRaw) * 100
						: msRaw.length === 2
							? Number(msRaw) * 10
							: Number(msRaw)
			const date = new Date(year, monthIndex, day, hours, minutes, seconds, milliseconds)
			if (
				date.getFullYear() === year &&
				date.getMonth() === monthIndex &&
				date.getDate() === day &&
				date.getHours() === hours &&
				date.getMinutes() === minutes &&
				date.getSeconds() === seconds &&
				date.getMilliseconds() === milliseconds
			) {
				return date
			}
			return null
		}

		return null
	}

	function pad2(n: number): string {
		return String(n).padStart(2, '0')
	}

	function formatNowForIndicator(date: Date): string {
		const y = date.getFullYear()
		const m = pad2(date.getMonth() + 1)
		const d = pad2(date.getDate())
		const hh = date.getHours()
		const mm = date.getMinutes()
		if (hh === 0 && mm === 0) return `${y}-${m}-${d}`
		return `${y}-${m}-${d}T${pad2(hh)}:${pad2(mm)}`
	}

	const nowOverrideParam = $derived(page.url.searchParams.get('now'))
	const nowOverride = $derived.by(() => parseNowParam(nowOverrideParam))
	const nowForRender = $derived(nowOverride ?? new Date())
	const isNowOverrideActive = $derived(nowOverride !== null)

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
	const todayArrowHandOpacity = 0.82
	const monthLabelRadius = 41.5
	const monthDotRadius = 41.5
	const monthDotSize = 0.32
	const monthLabelRotationDeg = 90
	// Season ring rotation, expressed as "days of the year".
	// This is intentionally a small fudge so the 24 segments land around solstice/equinox-ish dates.
	// IMPORTANT: this same offset must be applied to BOTH the season ring geometry and the arrow's
	// season color lookup, otherwise the arrow color can disagree with the season wedge it points at.
	// Note: SVG has a flipped Y axis, so increasing the angle visually rotates clockwise.
	const seasonRotationDays = 3
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
			let startAngle =
				(run.start / numSegments) * fullCircle - rotationOffset + seasonRotationRadians
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

	const todayArrow = $derived.by(() => {
		const tipRadius = r1 - 1.6

		const scale = 1.5
		const length = 3.2 * scale
		const halfWidth = 1.4 * scale
		const shaftWidth = 0.375 * scale
		const tailLength = 2.6 * scale
		const shaftOverlap = 0.4 * scale

		const now = nowForRender
		// dayOfYear is Jan 1 => 0, so Jan 1 points straight up (12 o'clock).
		const start = new Date(now.getFullYear(), 0, 1)
		const diff =
			now.getTime() -
			start.getTime() +
			(start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000
		const oneDay = 1000 * 60 * 60 * 24
		const dayOfYear = Math.floor(diff / oneDay)
		const angle = (dayOfYear / 365) * 2 * Math.PI - Math.PI / 2

		const baseRadius = tipRadius - length
		const tipX = 50 + tipRadius * Math.cos(angle)
		const tipY = 50 + tipRadius * Math.sin(angle)
		const baseX = 50 + baseRadius * Math.cos(angle)
		const baseY = 50 + baseRadius * Math.sin(angle)

		const shaftEndRadius = baseRadius + shaftOverlap
		const shaft = {
			x1: 50 - tailLength * Math.cos(angle),
			y1: 50 - tailLength * Math.sin(angle),
			x2: 50 + shaftEndRadius * Math.cos(angle),
			y2: 50 + shaftEndRadius * Math.sin(angle),
			width: shaftWidth,
		}

		const perpX = -Math.sin(angle) * halfWidth
		const perpY = Math.cos(angle) * halfWidth
		const points = `${baseX + perpX},${baseY + perpY} ${baseX - perpX},${baseY - perpY} ${tipX},${tipY}`

		// Undo the season ring rotation when mapping the arrow to a segment index.
		// This keeps the arrow color consistent with the season wedge it visually points to.
		const rotatedSegmentIndex = Math.floor(((dayOfYear - seasonRotationDays) / 365) * numSegments)
		const segmentIndex = ((rotatedSegmentIndex % numSegments) + numSegments) % numSegments
		const season = segments?.[segmentIndex] ?? fallbackSeason
		const color = seasons[season]?.color ?? seasons[fallbackSeason].color
		const ink = color

		return {
			ink,
			points,
			shaft,
		}
	})
</script>

<svelte:head>
	<link href="https://fonts.googleapis.com" rel="preconnect" />
	<link href="https://fonts.gstatic.com" rel="preconnect" />
	<link
		href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Fredericka+the+Great&family=Kaushan+Script&family=Ribeye+Marrow"
		rel="stylesheet"
	/>
</svelte:head>

<div class="calendar-wrap">
	<svg class="calendar-svg" height="100%" viewBox="0 0 100 100" width="100%">
		{#each shapes as shape, i (i)}
			<path d={shape.d} fill={shape.color} mask="url(#donut-mask)" />
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

		<g class="today-arrow">
			<g opacity={todayArrowHandOpacity}>
				<line
					x1={todayArrow.shaft.x1}
					y1={todayArrow.shaft.y1}
					x2={todayArrow.shaft.x2}
					y2={todayArrow.shaft.y2}
					stroke={todayArrow.ink}
					stroke-linecap="round"
					stroke-width={todayArrow.shaft.width}
				/>

				<polygon fill={todayArrow.ink} points={todayArrow.points} />
			</g>

			<circle
				cx="50"
				cy="50"
				fill="var(--dark)"
				r={todayArrow.shaft.width * 1.25}
				stroke={todayArrow.ink}
				stroke-width={todayArrow.shaft.width * 0.35}
			/>
		</g>

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

		<g class="calendar-title">
			<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="60"
				>A Realistic
			</text>
			<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="65"
				>{location}</text
			>
			<text fill="white" font-size={fontSize} font-weight="100" text-anchor="middle" x="50" y="70"
				>Calendar</text
			>
		</g>
	</svg>

	{#if dev && isNowOverrideActive}
		<div class="preview-now">Preview now: {formatNowForIndicator(nowForRender)}</div>
	{/if}
</div>

<style>
	.calendar-title text {
		paint-order: stroke;
		stroke: rgba(0, 0, 0, 0.28);
		stroke-linejoin: round;
		stroke-width: 0.55px;
	}

	.calendar-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
	}

	.calendar-svg {
		display: block;
	}

	.preview-now {
		margin-top: 0.35rem;
		text-align: center;
		opacity: 0.78;
		font-size: 0.95rem;
		font-weight: 300;
	}
</style>
