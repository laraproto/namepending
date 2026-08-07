<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc';
	import * as Card from '$lib/components/ui/card/index.js';
	import WarnsTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/warns-table.js';
	import type { PaginationState } from '@tanstack/table-core';

	let { data } = $props();

	let warnList = $derived(data.warns);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.warns
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((warns) => {
				warnList = warns;
			});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.warns
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((warns) => {
				warnList = warns;
			});
	};
</script>

<Head title="Warning List" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Warning List</Card.Title>
		</Card.Header>
		<Card.Content>
			<WarnsTable
				data={warnList.data}
				{columns}
				{onPageChange}
				pageCount={warnList.pageCount}
				rowCount={warnList.count}
				isManualPagination={true}
			/>
		</Card.Content>
	</Card.Root>
</div>
