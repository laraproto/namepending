<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import type { PageData } from './$types';
	import LoginForm from './login-form.svelte';

	let { data }: { data: PageData } = $props();
</script>

<Head title="Login" />

<div class="flex flex-1 items-center justify-center px-4">
	<LoginForm {data} />
</div>
