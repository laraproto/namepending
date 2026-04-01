<script lang="ts" module>
	import type { ColumnDef } from '@tanstack/table-core';
	import { renderComponent } from '$lib/components/ui/data-table/index.js';
	import { formatDistance } from 'date-fns';
	import PlayerTableActions from './player-table-actions.svelte';

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
			}
		}
	];
</script>

<script lang="ts">
	import type { PlayerSelectMinimal } from '@namepending/api/db';
	import DataTable from '../data-table.svelte';

	let { data }: { data: PlayerSelectMinimal[] } = $props();
</script>

<DataTable {data} {columns} />
