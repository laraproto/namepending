import { createAuthClient } from 'better-auth/svelte';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { oauthProviderClient } from '@better-auth/oauth-provider/client';

import { steamOpenIdClient } from '$lib/auth/plugins';

import type { Auth } from '$lib/server/auth';
import { URL } from '$app/env/public';

const authClient = createAuthClient({
	baseURL: URL,
	plugins: [steamOpenIdClient(), inferAdditionalFields<Auth>(), oauthProviderClient()]
});

export default authClient;
