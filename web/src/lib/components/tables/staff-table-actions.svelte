<script lang="ts">
	import EllipsisIcon from '@lucide/svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { resolve } from '$app/paths';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { hasPerm } from '$lib/perm-utils';

	let { id }: { id: string } = $props();

	const sidebar = Sidebar.useSidebar();
</script>

{#await hasPerm(sidebar.user, 'VIEW_USERS')}
	Checking
{:then canView}
	{#if canView}
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
						onclick={() => navigator.clipboard.writeText(id)}
					>
						Copy ID
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item class="cursor-pointer">
					{#snippet child({ props })}
						<a
							href={resolve('/profile/[id]', {
								id
							})}
							{...props}>View profile</a
						>
					{/snippet}</DropdownMenu.Item
				>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
{:catch error}
	Error: {error.message}
{/await}
