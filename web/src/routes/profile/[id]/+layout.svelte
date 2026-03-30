<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { onMount, onDestroy } from 'svelte';

	const sidebar = Sidebar.useSidebar();

	let { data, children }: LayoutProps = $props();

	onMount(() => {
		if (data.user) {
			sidebar.setToolbar(profileToolbar);
		}
	});

	onDestroy(() => {
		sidebar.setToolbar(null);
	});
</script>

{#snippet profileToolbar()}
	<div class="flex w-full items-center gap-2">
		<p>Profile nav</p>
	</div>
{/snippet}

{@render children?.()}
