import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { formatDistance } from 'date-fns';
import PlayerTableActions, { booleanBadge } from './player-table-actions.svelte';

import type { RouterOutput } from '$lib/trpc-client';

type BansOutput = RouterOutput['panel']['moderation']['bans'];

export const columns: ColumnDef<BansOutput['data'][number]>[] = [
	{
		accessorKey: 'banVictim.name',
		header: 'Name'
	},
	{
		accessorKey: 'banAuthor.name',
		header: 'Issued By'
	},
	{
		accessorFn: (row) => formatDistance(row.createdAt, new Date(), { addSuffix: true }),
		header: 'Created'
	},
	{
		accessorFn: (row) =>
			row.updatedAt ? formatDistance(row.updatedAt, new Date(), { addSuffix: true }) : null,
		header: 'Last Updated'
	},
	{
		accessorFn: (row) =>
			row.type === 'temporary' && row.expiresAt
				? formatDistance(row.expiresAt, new Date(), { addSuffix: true })
				: 'Never',
		header: 'Expires'
	},
	{
		cell: ({ row }) =>
			renderSnippet(booleanBadge, {
				bool: row.original.active,
				colorInverse: true,
				trueText: 'Active',
				falseText: 'Expired'
			}),
		header: 'Status'
	},
	{
		id: 'actions',
		cell: ({ row }) => {
			return renderComponent(PlayerTableActions, { id: row.original.banVictim.platformId });
		},
		header: 'Actions'
	}
];
