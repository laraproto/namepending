import type { ColumnDef } from '@tanstack/table-core';
import { formatDistance } from 'date-fns';
import ServersTableActions from './servers-table-actions.svelte';
import { renderComponent } from '$lib/components/ui/data-table/index.js';

import type { RouterOutput } from '$lib/trpc';

type ListUserOutput = RouterOutput['panel']['administration']['getServers'];

export const columns: ColumnDef<ListUserOutput['data'][number]>[] = [
	{
		accessorKey: 'uuid',
		header: 'ID'
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
			return renderComponent(ServersTableActions, { id: row.original.uuid });
		},
		header: 'Actions'
	}
];
