<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import LinkAccountForm from './link-account-form.svelte';
	import LinkSocials from './link-socials.svelte';

	let { data } = $props();
</script>

<Head title="General Settings" />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
		<LinkAccountForm {data} />
		<LinkSocials />
	</div>
</div>
