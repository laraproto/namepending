<script module>
	export { booleanBadge };
</script>

<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BadgeXIcon from '@lucide/svelte/icons/badge-x';
	import { resolve } from '$app/paths';

	let { id }: { id: string } = $props();
</script>

{#snippet booleanBadge({
	bool,
	colorInverse = false,
	trueText = 'Yes',
	falseText = 'No'
}: {
	bool: boolean;
	colorInverse?: boolean;
	trueText?: string;
	falseText?: string;
})}
	<Badge
		variant="secondary"
		class={colorInverse
			? [
					!bool && 'bg-lime-500 dark:bg-lime-600',
					bool && 'bg-red-500 dark:bg-red-600',
					'text-white'
				]
			: [
					bool && 'bg-lime-500 dark:bg-lime-600',
					!bool && 'bg-red-500 dark:bg-red-600',
					'text-white'
				]}
	>
		{#if bool}<BadgeCheckIcon />{:else}<BadgeXIcon />{/if}
		{bool ? trueText : falseText}
	</Badge>
{/snippet}

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Open menu</span>
				<EllipsisIcon />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item class="cursor-pointer" onclick={() => navigator.clipboard.writeText(id)}>
				Copy platform ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item class="cursor-pointer">
			{#snippet child({ props })}
				<a
					href={resolve('/player/[id]', {
						id
					})}
					{...props}>View player</a
				>
			{/snippet}</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
