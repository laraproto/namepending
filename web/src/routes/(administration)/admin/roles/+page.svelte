<script lang="ts">
	import type { PageProps } from './$types';
	import RoleDialog from './role-dialog.svelte';

	let { data }: PageProps = $props();
</script>

<RoleDialog />
