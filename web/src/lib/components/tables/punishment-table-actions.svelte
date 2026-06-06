<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import trpc from '$lib/trpc-client';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import BadgeCheckIcon from '@lucide/svelte/icons/badge-check';
	import BadgeXIcon from '@lucide/svelte/icons/badge-x';
	import { invalidateAll } from '$app/navigation';
	import DeleteConfirmDialog from '$lib/components/delete-confirm-dialog.svelte';
	import { hasPermSync } from '$lib/perm-utils';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { resolve } from '$app/paths';

	let { id, punishmentId, type }: { id: string; punishmentId: string; type: 'warn' | 'ban' } =
		$props();

	const sidebar = Sidebar.useSidebar();

	let deleteDialogOpen = $state(false);
</script>

<DeleteConfirmDialog
	bind:open={deleteDialogOpen}
	onConfirm={() => {
		if (type === 'warn') {
			trpc.panel.moderation.deleteWarn.mutate({ id: punishmentId });
		} else if (type === 'ban') {
			trpc.panel.moderation.deleteBan.mutate({ id: punishmentId });
		}
		deleteDialogOpen = false;
		invalidateAll();
	}}
/>

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
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				deleteDialogOpen = true;
			}}
			disabled={(type === 'warn' && !hasPermSync(sidebar.user, 'DELETE_WARNINGS')) ||
				(type === 'ban' && !hasPermSync(sidebar.user, 'DELETE_BANS'))}
		>
			Delete {type}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
