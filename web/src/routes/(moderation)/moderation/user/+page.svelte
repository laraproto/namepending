<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc-client';
	import * as Card from '$lib/components/ui/card/index.js';
	import UserTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/user-table.js';
	import type { PaginationState } from '@tanstack/table-core';

	let { data } = $props();

	let userList = $derived(data.users);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.panel.moderation.searchUser
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((users) => {
				userList = users;
			});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.panel.moderation.searchUser
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((users) => {
				userList = users;
			});
	};
</script>

<Head title="User Search" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>User Search</Card.Title>
		</Card.Header>
		<Card.Content>
			<UserTable
				data={userList.data}
				{columns}
				{onPageChange}
				pageCount={userList.pageCount}
				rowCount={userList.count}
				isManualPagination={true}
			/>
		</Card.Content>
	</Card.Root>
</div>
