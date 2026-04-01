<script lang="ts" module>
	import type { ColumnDef } from '@tanstack/table-core';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import { formatDistance } from 'date-fns';
	import StaffTableActions from './staff-table-actions.svelte';

	export const columns: ColumnDef<ListStaffOutput[number]>[] = [
		{
			accessorKey: 'name',
			header: 'Name'
		},
		{
			accessorKey: 'group.name',
			header: 'Group'
		},
		{
			accessorFn: (row) => formatDistance(row.createdAt, new Date(), { addSuffix: true }),
			header: 'Joined'
		},
		{
			accessorFn: (row) => formatDistance(row.updatedAt, new Date(), { addSuffix: true }),
			header: 'Last Updated'
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				return renderComponent(StaffTableActions, { id: row.original.id });
			}
		}
	];
</script>

<script lang="ts">
	import type { RouterOutput } from '$lib/trpc-client';
	import DataTable from '../data-table.svelte';

	type ListStaffOutput = RouterOutput['listStaff'];

	let { data }: { data: ListStaffOutput } = $props();
</script>

<DataTable {data} {columns} />
