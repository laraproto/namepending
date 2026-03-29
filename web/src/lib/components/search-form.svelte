<script lang="ts">
	import SearchIcon from '@lucide/svelte/icons/search';
	import { Label } from '$lib/components/ui/label/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { HTMLFormAttributes } from 'svelte/elements';
	import type { WithElementRef } from '$lib/utils.js';

	const sidebar = Sidebar.useSidebar();

	let { ref = $bindable(null), ...restProps }: WithElementRef<HTMLFormAttributes> = $props();

	let searchDialogOpen = $state(false);

	function getOpen() {
		return searchDialogOpen;
	}

	function setOpen(newOpen: boolean) {
		searchDialogOpen = newOpen;
	}
</script>

<form {...restProps} bind:this={ref}>
	{#if !sidebar.isMobile}
		<div class="relative">
			<Label for="search" class="sr-only">Search</Label>
			<Sidebar.Input
				oninput={(e) => sidebar.setSearchValue((e.target as HTMLInputElement).value)}
				value={sidebar.searchValue}
				id="search"
				placeholder="Search"
				class="h-8 ps-7"
			/>
			<SearchIcon
				class="pointer-events-none absolute inset-s-2 top-1/2 size-4 -translate-y-1/2 opacity-50 select-none"
			/>
		</div>
	{:else}
		<Dialog.Root bind:open={getOpen, setOpen}>
			<Dialog.Trigger type="button" class={[buttonVariants({ variant: 'outline' }), 'relative']}>
				<SearchIcon class="size-4" />
			</Dialog.Trigger>
			<Dialog.Content>
				<Dialog.Header>
					<Dialog.Title>Search</Dialog.Title>
				</Dialog.Header>
				<div class="relative">
					<Label for="search" class="sr-only">Search</Label>
					<Sidebar.Input
						oninput={(e) => sidebar.setSearchValue((e.target as HTMLInputElement).value)}
						value={sidebar.searchValue}
						onkeydown={(e) => {
							if (e.key === 'Enter') {
								e.preventDefault();
								setOpen(false);
							}
						}}
						id="search"
						placeholder="Search"
						class="h-8 ps-7"
					/>
					<SearchIcon
						class="pointer-events-none absolute inset-s-2 top-1/2 size-4 -translate-y-1/2 opacity-50 select-none"
					/>
				</div>
			</Dialog.Content>
		</Dialog.Root>
	{/if}
</form>
