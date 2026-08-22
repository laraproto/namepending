import auth from '$lib/server/auth';
import { createAuthClient } from 'better-auth/client';
import { oauthProviderResourceClient } from '@better-auth/oauth-provider/resource-client';
import { getRequestEvent } from '$app/server';

const serverClient = createAuthClient({
	plugins: [
		oauthProviderResourceClient(auth) // auth optional
	],
	fetchOptions: {
		headers: () => getRequestEvent().request.headers
	}
});

export default serverClient;
