<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import type { PageData } from './$types';
	import LoginForm from './login-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Head title="Login" />

<div class="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-md">
		<LoginForm {data} />
	</div>
</div>
