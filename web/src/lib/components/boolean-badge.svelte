<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index.js';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BadgeXIcon from '@lucide/svelte/icons/badge-x';

	let {
		bool,
		colorInverse = false,
		trueText = 'Yes',
		falseText = 'No'
	}: {
		bool: boolean;
		colorInverse?: boolean;
		trueText?: string;
		falseText?: string;
	} = $props();
</script>

<Badge
	variant="secondary"
	class={colorInverse
		? [!bool && 'bg-lime-500 dark:bg-lime-600', bool && 'bg-red-500 dark:bg-red-600', 'text-white']
		: [bool && 'bg-lime-500 dark:bg-lime-600', !bool && 'bg-red-500 dark:bg-red-600', 'text-white']}
>
	{#if bool}<BadgeCheckIcon />{:else}<BadgeXIcon />{/if}
	{bool ? trueText : falseText}
</Badge>
