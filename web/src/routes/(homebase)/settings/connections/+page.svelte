<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	$inspect(data.connections);
</script>
