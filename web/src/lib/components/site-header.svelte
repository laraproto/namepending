<script lang="ts">
	import SidebarIcon from '@lucide/svelte/icons/sidebar';
	import SearchForm from './search-form.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	const sidebar = Sidebar.useSidebar();
</script>

<header class="sticky top-0 z-50 flex w-full items-center border-b bg-background">
	<div class="flex h-(--header-height) w-full items-center gap-2 px-4">
		<Button class="size-8" variant="ghost" size="icon" onclick={sidebar.toggle}>
			<SidebarIcon />
		</Button>
		<Separator orientation="vertical" class="me-2 h-4" />
		<div class="w-full sm:ms-auto sm:w-auto">
			{@render sidebar.toolbar?.()}
		</div>
		{#if sidebar.showSearch}
			<SearchForm class="ms-auto w-auto" />
		{/if}
	</div>
</header>
