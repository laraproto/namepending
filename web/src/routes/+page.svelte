<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import trpc from '$lib/trpc-client';
</script>

<Head title="Home" />
{#await trpc.hello.query({ name: 'world' })}
	<p>Waiting for promise...</p>
{:then data}
	<p>{data}</p>
{:catch error}
	<p>TRPC Query Error: {error.message}</p>
{/await}

{#await trpc.permsDebug.query()}
	<p>Waiting for perms debug query...</p>
{:then data}
	<p>{JSON.stringify(data, undefined, 2)}</p>
{:catch error}
	<p>TRPC Query Error: {error.message}</p>
{/await}

<a href="/api/auth/steam/redirect" rel="external">Test Steam Link</a>
