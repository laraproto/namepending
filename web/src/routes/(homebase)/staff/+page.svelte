<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc-client';
	import * as Card from '$lib/components/ui/card/index.js';
	import StaffTable from '$lib/components/tables/staff-table.svelte';
	import { columns } from '$lib/components/tables/staff-table.js';
	import type { PaginationState } from '@tanstack/table-core';

	let { data } = $props();

	let staffList = $derived(data.staff);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.listStaff
			.query({
				query: sidebar.searchValue,
				page: sidebar.page + 1
			})
			.then((staff) => {
				staffList = staff;
			});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});

	const onPageChange = (pagination: PaginationState) => {
		trpc.listStaff
			.query({
				query: sidebar.searchValue,
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize
			})
			.then((staff) => {
				staffList = staff;
			});
	};
</script>

<Head title="Staff List" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Staff List</Card.Title>
		</Card.Header>
		<Card.Content>
			<StaffTable
				data={staffList.data}
				{columns}
				{onPageChange}
				pageCount={staffList.pageCount}
				rowCount={staffList.count}
				isManualPagination={true}
			/>
		</Card.Content>
	</Card.Root>
</div>
