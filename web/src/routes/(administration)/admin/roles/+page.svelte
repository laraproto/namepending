<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import RoleTable from '$lib/components/tables/player-table.svelte';
	import { columns as columnsGame } from '$lib/components/tables/game-group-roles-table.js';
	import { columns as columnsPanel } from '$lib/components/tables/panel-group-roles-table.js';

	let { data } = $props();

	let gameList = $derived(data.gameRoles);
	let panelList = $derived(data.panelRoles);
</script>

<Head title="Role Management" />

<div class="mx-auto my-8 w-full space-y-4 px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Game Group Roles</Card.Title>
		</Card.Header>
		<Card.Content>
			<RoleTable
				data={gameList.data}
				columns={columnsGame}
				pageCount={gameList.pageCount}
				rowCount={gameList.count}
				isManualPagination={false}
			/>
		</Card.Content>
	</Card.Root>
	<Card.Root>
		<Card.Header>
			<Card.Title>Panel Group Roles</Card.Title>
		</Card.Header>
		<Card.Content>
			<RoleTable
				data={panelList.data}
				columns={columnsPanel}
				pageCount={panelList.pageCount}
				rowCount={panelList.count}
				isManualPagination={false}
			/>
		</Card.Content>
	</Card.Root>
</div>
