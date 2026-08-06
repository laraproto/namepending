import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { formatDistance } from 'date-fns';
import StaffTableActions from './staff-table-actions.svelte';

import type { RouterOutput } from '$lib/trpc';

type ListUserOutput = RouterOutput['panel']['moderation']['searchUser'];

export const columns: ColumnDef<ListUserOutput['data'][number]>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorFn: (row) => row.group?.name ?? 'None',
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
		},
		enableHiding: true,
		header: 'Actions'
	}
];
