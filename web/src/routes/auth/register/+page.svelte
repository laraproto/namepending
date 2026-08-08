<script lang="ts">
	import RegisterForm from './register-form.svelte';
	import Head from '$lib/components/Head.svelte';
	import type { PageData } from './$types';
	let { data }: { data: PageData } = $props();
</script>

<Head title="Register" />

<div class="flex flex-1 flex-col items-center justify-center p-6 md:p-10">
	<div class="w-full max-w-sm md:max-w-md">
		<RegisterForm {data} />
	</div>
</div>
