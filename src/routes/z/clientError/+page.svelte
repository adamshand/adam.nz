<script lang="ts">
	import { onMount } from 'svelte'

	onMount(() => {
		throw new Error('CSR (onMOunt) Test Error')
	})
</script>

<p>nothing here</p>
