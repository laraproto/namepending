import type { ColumnDef } from '@tanstack/table-core';
import { formatDistance } from 'date-fns';

import type { RouterOutput } from '$lib/trpc-client';

type ListUserOutput = RouterOutput['panel']['administration']['getServers'];

export const columns: ColumnDef<ListUserOutput['data'][number]>[] = [
	{
		accessorKey: 'uuid',
		header: 'Name'
	},
	{
		accessorKey: 'description',
		header: 'Description'
	},
	{
		accessorFn: (row) => formatDistance(row.createdAt, new Date(), { addSuffix: true }),
		header: 'Created At'
	}
];
