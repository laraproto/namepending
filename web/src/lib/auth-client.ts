import { createAuthClient } from 'better-auth/svelte';

import { steamOpenIdClient } from '@namepending/api/auth-plugins';

import { env } from '$env/dynamic/public';

const authClient = createAuthClient({
	baseURL: env.PUBLIC_URL,
	plugins: [steamOpenIdClient()]
});

export default authClient;
