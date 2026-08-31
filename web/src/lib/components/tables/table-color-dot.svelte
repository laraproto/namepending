<script lang="ts">
	import ColorDot from '../color-dot.svelte';

	let { color, colorName }: { color: string; colorName: string } = $props();
</script>

<span class="flex items-center gap-2">
	<ColorDot {color} />
	<span>{colorName}</span>
</span>
