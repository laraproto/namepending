<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Head from '$lib/components/Head.svelte';
	import { onMount, onDestroy } from 'svelte';
	import trpc from '$lib/trpc-client';
	import * as Card from '$lib/components/ui/card/index.js';
	import StaffTable from '$lib/components/tables/staff-table.svelte';
	import { columns } from '$lib/components/tables/staff-table.js';

	let { data } = $props();

	let staffList = $derived(data.staff);

	const sidebar = Sidebar.useSidebar();

	$effect(() => {
		trpc.listStaff.query(sidebar.searchValue).then((staff) => {
			staffList = staff;
		});
	});

	onMount(() => {
		sidebar.setShowSearch(true);
	});

	onDestroy(() => {
		sidebar.setShowSearch(false);
	});
</script>

<Head title="Staff List" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Staff List</Card.Title>
		</Card.Header>
		<Card.Content>
			<StaffTable data={staffList} {columns} />
		</Card.Content>
	</Card.Root>
</div>
