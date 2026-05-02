<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc-client';
	import * as Card from '$lib/components/ui/card/index.js';
	import PlayerTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/player-table.js';
	import type { PaginationState } from '@tanstack/table-core';

	let { data } = $props();

	let playerList = $derived(data.players);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.searchPlayer
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((players) => {
				playerList = players;
			});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.searchPlayer
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((players) => {
				playerList = players;
			});
	};
</script>

<Head title="Player Search" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Player Search</Card.Title>
		</Card.Header>
		<Card.Content>
			<PlayerTable
				data={playerList.data}
				{columns}
				{onPageChange}
				pageCount={playerList.pageCount}
				rowCount={playerList.count}
				isManualPagination={true}
			/>
		</Card.Content>
	</Card.Root>
</div>
