<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import trpc from '$lib/trpc';
	import { invalidateAll } from '$app/navigation';
	import DeleteConfirmDialog from '$lib/components/delete-confirm-dialog.svelte';
	import { hasPermSync } from '$lib/perm-utils';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { resolve } from '$app/paths';

	let { id, type }: { id: string; type: 'game' | 'panel' } = $props();

	const sidebar = Sidebar.useSidebar();

	let deleteDialogOpen = $state(false);
</script>

<DeleteConfirmDialog
	bind:open={deleteDialogOpen}
	onConfirm={() => {
		if (type === 'game') {
			trpc.panel.administration.deleteGameGroup.mutate({ id });
		} else {
			trpc.panel.administration.deletePanelGroup.mutate({ id });
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
			<DropdownMenu.Item
				class="cursor-pointer"
				disabled={!hasPermSync(sidebar.user, 'CREATE_EDIT_ROLES')}
			>
				{#snippet child({ props })}
					<a href={resolve(`/(administration)/admin/roles/${type}/[id]`, { id })} {...props}
						>Edit role</a
					>
				{/snippet}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				deleteDialogOpen = true;
			}}
			disabled={!hasPermSync(sidebar.user, 'DELETE_ROLES')}
		>
			Delete role</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
