import type { ColumnDef } from '@tanstack/table-core';
import { formatDistance } from 'date-fns';
import RoleTableActions from './role-table-actions.svelte';
import TableColorDot from './table-color-dot.svelte';
import { Colors } from '@namepending/shared/sl';
import { renderComponent } from '$lib/components/ui/data-table/index.js';

import type { RouterOutput } from '$lib/trpc';

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
		header: 'Color',
		cell: ({ row }) => {
			return renderComponent(TableColorDot, {
				color: Colors[row.original.color as keyof typeof Colors],
				colorName: row.original.color
			});
		}
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
