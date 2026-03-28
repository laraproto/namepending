<script lang="ts">
	import { page } from '$app/state';
	import Head from '$lib/components/Head.svelte';
</script>

<Head title="Authentication Failed" />

<h1>Authentication Failed</h1>
<p>Code value: {page.url.searchParams.get('error')}</p>
