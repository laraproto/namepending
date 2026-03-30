<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	onMount(() => {
		sidebar.setShowSearch(true);
		sidebar.setToolbar(filterToolbar);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
		sidebar.setToolbar(null);
	});
</script>

{#snippet filterToolbar()}
	<p>Hi!</p>
{/snippet}

<Head title="Staff List" />
