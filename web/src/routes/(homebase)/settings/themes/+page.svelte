<script lang="ts">
	import type { PageProps } from './$types';
	import ThemeView from './theme-view.svelte';

	let { data }: PageProps = $props();
</script>

<div class="flex flex-1 items-center justify-center">
	<ThemeView user={data.localUser} />
</div>
