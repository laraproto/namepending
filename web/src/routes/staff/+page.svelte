<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onDestroy } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	sidebar.setShowSearch(true);

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});
</script>

<Head title="Staff List" />
