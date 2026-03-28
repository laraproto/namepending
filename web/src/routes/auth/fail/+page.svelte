<script lang="ts">
	import { page } from '$app/state';
</script>

<h1>Authentication Failed</h1>
<p>Code value: {page.url.searchParams.get('error')}</p>
