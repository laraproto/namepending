import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent, renderSnippet } from '$lib/components/ui/data-table/index.js';
import { formatDistance } from 'date-fns';
import { booleanBadge } from './player-table-actions.svelte';
import PunishmentTableActions from './punishment-table-actions.svelte';

import type { RouterOutput } from '$lib/trpc-client';

type WarnsOutput = RouterOutput['panel']['moderation']['warns'];

export const columns: ColumnDef<WarnsOutput['data'][number]>[] = [
	{
		accessorKey: 'warnVictim.name',
		header: 'Name'
	},
	{
		accessorKey: 'warnAuthor.name',
		header: 'Issued By'
	},
	{
		accessorKey: 'reason',
		header: 'Reason'
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
		header: 'Type',
		accessorFn: (row) => {
			switch (row.type) {
				case 'tempminor':
					return 'Temporary Minor';
				case 'tempmajor':
					return 'Temporary Major';
				case 'minor':
					return 'Minor';
				case 'major':
					return 'Major';
			}
		}
	},
	{
		accessorFn: (row) =>
			(row.type === 'tempminor' || row.type === 'tempmajor') && row.expiresAt
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
			return renderComponent(PunishmentTableActions, {
				id: row.original.warnVictim.platformId,
				punishmentId: row.original.uuid,
				type: 'warn'
			});
		},
		header: 'Actions'
	}
];
