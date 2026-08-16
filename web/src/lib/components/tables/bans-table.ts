import type { ColumnDef } from '@tanstack/table-core';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import { formatDistance } from 'date-fns';
import BooleanBadge from '$lib/components/boolean-badge.svelte';
import PunishmentTableActions from './punishment-table-actions.svelte';

import type { RouterOutput } from '$lib/trpc';

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
		accessorFn: (row) =>
			row.type === 'temporary' && row.expiresAt
				? formatDistance(row.expiresAt, new Date(), { addSuffix: true })
				: 'Never',
		header: 'Expires'
	},
	{
		cell: ({ row }) =>
			renderComponent(BooleanBadge, {
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
				id: row.original.banVictim.platformId,
				punishmentId: row.original.uuid,
				type: 'ban'
			});
		},
		header: 'Actions'
	}
];
