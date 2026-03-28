import { createAuthClient } from 'better-auth/client';

import { steamOpenIdClient } from '@namepending/api/auth-plugins';

import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';

const authServer = createAuthClient({
	baseURL: env.PUBLIC_URL,
	plugins: [steamOpenIdClient()],
	fetchOptions: {
		onSuccess: (ctx) => {
			const authToken = ctx.response.headers.get('set-auth-token'); // get the token from the response headers
			if (authToken) {
				getRequestEvent().cookies.set('__Secure-namepending.session_token', authToken, {
					httpOnly: true,
					secure: true,
					sameSite: 'lax',
					path: '/',
					maxAge: 60 * 60 * 24 * 7 // 7 days
				});
			}
		},
		auth: {
			type: 'Bearer',
			token: () => getRequestEvent().cookies.get('__Secure-namepending.session_token')
		}
	}
});

export default authServer;
