<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc-client';
	import * as Card from '$lib/components/ui/card/index.js';
	import BansTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/bans-table.js';
	import type { PaginationState } from '@tanstack/table-core';

	let { data } = $props();

	let banList = $derived(data.bans);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.bans
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((bans) => {
				banList = bans;
			});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.bans
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((bans) => {
				banList = bans;
			});
	};
</script>

<Head title="Ban List" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Ban List</Card.Title>
		</Card.Header>
		<Card.Content>
			<BansTable
				data={banList.data}
				{columns}
				{onPageChange}
				pageCount={banList.pageCount}
				rowCount={banList.count}
				isManualPagination={true}
			/>
		</Card.Content>
	</Card.Root>
</div>
