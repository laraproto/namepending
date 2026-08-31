<script lang="ts">
	import SidebarIcon from '@lucide/svelte/icons/sidebar';
	import SearchForm from './search-form.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { DEMO } from '$app/env/public';

	const sidebar = Sidebar.useSidebar();
</script>

<header class="sticky top-0 z-50 flex w-full border-b bg-background">
	{#if DEMO}
		<div
			class="text-destructive-foreground relative flex items-center justify-center bg-destructive px-4 py-2 text-center text-sm"
		>
			<span class="font-medium"
				>Demo mode is enabled. I do not recommend using this in a production environment.</span
			>
		</div>
	{/if}
	<div class="relative flex h-(--header-height) w-full items-center gap-2 px-4">
		<div class="flex items-center gap-2">
			<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
				<SidebarIcon />
			</Button>
			<Separator orientation="vertical" class="me-2 h-4" />
		</div>

		<div class="pointer-events-none absolute inset-x-0 flex justify-center px-16">
			<div class="pointer-events-auto max-w-full">
				{@render sidebar.toolbar?.(sidebar.toolbarData)}
			</div>
		</div>

		{#if sidebar.showSearch}
			<SearchForm class="ms-auto w-auto" />
		{/if}
	</div>
</header>
