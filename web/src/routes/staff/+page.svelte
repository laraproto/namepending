<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onDestroy } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	sidebar.setShowSearch(true);
	sidebar.setToolbar(filterSnippet);

	onDestroy(() => {
		sidebar.setShowSearch(false);
		sidebar.setToolbar(null);
	});
</script>

{#snippet filterSnippet()}
	<p>Hi!</p>
{/snippet}

<Head title="Staff List" />
