import { createAuthClient } from 'better-auth/svelte';
import { env } from '$env/dynamic/public';

const authClient = createAuthClient({
	baseURL: env.PUBLIC_URL
});

export default authClient;
