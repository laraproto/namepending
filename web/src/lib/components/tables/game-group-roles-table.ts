import type { ColumnDef } from '@tanstack/table-core';
import { formatDistance } from 'date-fns';
import RoleTableActions from './role-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table/index.js';

import type { RouterOutput } from '$lib/trpc-client';

type ListUserOutput = RouterOutput['panel']['administration']['getGameRoles'];

export const columns: ColumnDef<ListUserOutput['data'][number]>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	{
		accessorFn: (row) => formatDistance(row.createdAt, new Date(), { addSuffix: true }),
		header: 'Created At'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(RoleTableActions, { id: row.original.uuid, type: 'game' });
		},
		header: 'Actions'
	}
];
