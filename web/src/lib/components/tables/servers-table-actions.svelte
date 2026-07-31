<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import DeleteConfirmDialog from '$lib/components/delete-confirm-dialog.svelte';
	import trpc from '$lib/trpc-client';
	import { invalidateAll } from '$app/navigation';

	let { id }: { id: string } = $props();

	let deleteDialogOpen = $state(false);
</script>

<DeleteConfirmDialog
	bind:open={deleteDialogOpen}
	onConfirm={() => {
		trpc.panel.administration.deleteServer.mutate({ id });
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
		<DropdownMenu.Item
			class="cursor-pointer"
			onclick={() => {
				deleteDialogOpen = true;
			}}
		>
			Delete server</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
