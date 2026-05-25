<script lang="ts">
	import type { PageProps } from './$types';
	import PanelGroupDialog from './panel-group-dialog.svelte';
	import GameGroupDialog from './game-group-dialog.svelte';

	let { data }: PageProps = $props();
</script>

<PanelGroupDialog open={true} formVal={data.panelGroupForm} />
<GameGroupDialog open={true} formVal={data.gameGroupForm} />
