<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();
</script>

<Head title="Settings" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Settings</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>UwU</p>
		</Card.Content>
	</Card.Root>
</div>
