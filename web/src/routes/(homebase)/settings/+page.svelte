<script lang="ts">
	import * as Card from '$lib/components/ui/card';

	import Head from '$lib/components/Head.svelte';
</script>

<Head title="General Settings" />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<Card.Root class="h-full">
			<Card.Header>
				<Card.Title>Account Link</Card.Title>
				<Card.Description>Associate a player profile with your account</Card.Description>
			</Card.Header>
			<form>
				<Card.Content></Card.Content>
				<Card.Footer class="flex w-full items-center gap-2"></Card.Footer>
			</form>
		</Card.Root>
	</div>
</div>
