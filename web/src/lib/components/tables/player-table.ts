import type { ColumnDef } from '@tanstack/table-core';
import BooleanBadge from '$lib/components/boolean-badge.svelte';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { formatDistance } from 'date-fns';
import PlayerTableActions from './player-table-actions.svelte';
import type { PlayerSelectMinimal } from '$lib/server/db/schema';

export const columns: ColumnDef<PlayerSelectMinimal>[] = [
	{
		accessorKey: 'name',
		header: 'Name'
	},
	{
		accessorKey: 'platformId',
		header: 'Platform ID'
	},
	{
		accessorKey: 'doNotTrack',
		cell: ({ row }) => {
			return renderComponent(BooleanBadge, { bool: row.original.doNotTrack, colorInverse: true });
		},
		header: 'Do Not Track'
	},
	{
		accessorFn: (row) => formatDistance(row.createdAt, new Date(), { addSuffix: true }),
		header: 'Joined'
	},
	{
		accessorFn: (row) =>
			row.updatedAt ? formatDistance(row.updatedAt, new Date(), { addSuffix: true }) : null,
		header: 'Updated'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(PlayerTableActions, { id: row.original.platformId });
		},
		header: 'Actions'
	}
];
