<script lang="ts">
	import RegisterForm from './register-form.svelte';
	import type { PageData } from './$types.js';
	let { data }: { data: PageData } = $props();
</script>

<div class="flex w-full flex-1 items-center justify-center p-6 md:p-10">
	<RegisterForm {data} />
</div>
