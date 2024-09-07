<script lang="ts">
	// import type { SegmentsType, SeasonsType } from '$lib/types'
	import Calendar from './Calendar.svelte'

	let segments: { [key: number]: 'autumn' | 'shitsville' | 'spring' | 'summer' | 'winter' } = {
		0: 'spring',
		1: 'summer',
		2: 'summer',
		3: 'summer',
		4: 'summer',
		5: 'autumn',
		6: 'autumn',
		7: 'autumn',
		8: 'autumn',
		9: 'autumn',
		10: 'autumn',
		11: 'winter',
		12: 'winter',
		13: 'winter',
		14: 'winter',
		15: 'spring',
		16: 'spring',
		17: 'shitsville',
		18: 'shitsville',
		19: 'shitsville',
		20: 'shitsville',
		21: 'shitsville',
		22: 'shitsville',
		23: 'spring',
	}
</script>

<section>
	<Calendar location="Wellington" {segments} />
</section>

<style>
	/* * {
		border: 1px solid salmon;
	} */
	section {
		width: 100%;
		height: 70vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
