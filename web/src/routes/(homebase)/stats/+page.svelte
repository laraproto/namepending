<script>
	import Head from '$lib/components/Head.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar';

	const sidebar = Sidebar.useSidebar();
</script>

<Head title="Player Stats" />

{#if sidebar.user}
	<p>
		Logged in as {sidebar.user.name} (id: {sidebar.user.id})
		<br />
		Group: {sidebar.user.group ? sidebar.user.group.name : 'None'}
		<br />
		User flags: {sidebar.user.flags} (bitwise)
		<br />
		Group flags: {sidebar.user.group ? sidebar.user.group.permissions : 'N/A'} (bitwise)
	</p>
{/if}
