<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import LinkAccountForm from './link-account-form.svelte';
	import { Button } from '$lib/components/ui/button/index.js';

	import authClient from '$lib/auth';

	let { data } = $props();
</script>

<Head title="General Settings" />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<LinkAccountForm {data} />
		<Card.Root class="h-full">
			<Card.Header>
				<Card.Title>Steam Link</Card.Title>
				<Card.Description>Link your Steam account to your account</Card.Description>
			</Card.Header>
			<Card.Content class="mb-4">
				<Button
					onclick={async () => {
						const res = await authClient.steam.redirect();

						if (res.data) {
							window.location.href = res.data.url;
						}
					}}>Link Steam</Button
				>
			</Card.Content>
		</Card.Root>
	</div>
</div>
