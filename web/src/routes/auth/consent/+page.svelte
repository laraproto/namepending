<script lang="ts">
	import type { PageProps } from './$types';
	import { Button } from '$lib/components/ui/button/index.js';
	import authClient from '$lib/auth';

	let { data }: PageProps = $props();
</script>

Temporary auth consent test Do you consent to {data.client.client_name ?? data.client.client_id} accessing
your account?
<span class="">
	<Button
		variant="default"
		onclick={() => {
			authClient.oauth2.consent({
				accept: true
			});
		}}
	>
		Yes
	</Button>
	<Button
		variant="secondary"
		onclick={() => {
			authClient.oauth2.consent({
				accept: false
			});
		}}
	>
		No
	</Button>
</span>
