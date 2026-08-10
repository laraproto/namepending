<script lang="ts">
	import './layout.css';
	import '$lib/theme.scss';
	import { ModeWatcher } from 'mode-watcher';
	import favicon from '$lib/assets/lara.png';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import SiteHeader from '$lib/components/site-header.svelte';
	import AppSidebar from '$lib/components/app-sidebar.svelte';

	let { children, data } = $props();
</script>

<ModeWatcher />
<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="[--header-height:calc(--spacing(14))]">
	<Sidebar.Provider class="flex flex-col" user={data.localUser} open={data.sidebarOpen}>
		<SiteHeader />
		<div class="flex flex-1">
			<AppSidebar />
			<Sidebar.Inset>
				<div class="flex flex-1 flex-col p-4">
					{@render children?.()}
				</div>
			</Sidebar.Inset>
		</div>
	</Sidebar.Provider>
</div>
