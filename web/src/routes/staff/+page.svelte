<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { onDestroy } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	sidebar.setShowSearch(true);

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});
</script>
