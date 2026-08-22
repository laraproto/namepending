<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
</script>

<Head title="Settings" />

<div class="mx-auto my-8 w-full px-4">
	<Card.Root>
		<Card.Header>
			<Card.Title>Settings</Card.Title>
		</Card.Header>
		<Card.Content>
			<p>
				I have no idea what I wanted to do with this settings page, if you wish to change any
				settings, edit the .env and recreate the containers
			</p>
		</Card.Content>
	</Card.Root>
</div>
