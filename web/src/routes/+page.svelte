<script lang="ts">
	import trpc from '$lib/trpc-client';
</script>

<h1>Welcome to SvelteKit!</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

{#await trpc.hello.query({ name: 'world' })}
	<p>Waiting for promise...</p>
{:then data}
	<p>{data}</p>
{:catch error}
	<p>TRPC Query Error: {error.message}</p>
{/await}
