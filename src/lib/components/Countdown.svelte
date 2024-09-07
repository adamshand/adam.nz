<script lang="ts">
	import { onMount } from 'svelte'

	let { countdown = 10 } = $props()
	// export let fontSize = '1rem'

	let timer: ReturnType<typeof setInterval> | null

	// FIXME: add clearInterval to onMount
	// $: {
	// 	if (countdown === 0) {
	// 		if (timer) {
	// 			clearInterval(timer)
	// 			timer = null
	// 		}
	// 	}
	// }

	onMount(() => {
		timer = setInterval(() => {
			countdown -= 1
		}, 1000)

		// return () => {
		// 	clearInterval(timer)
		// }
	})
</script>

<!-- <span style={'font-size: ' + fontSize + ';'}>{countdown}</span> -->
<span>{countdown}</span>
