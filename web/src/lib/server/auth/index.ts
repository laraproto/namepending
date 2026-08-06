import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { steamOpenId } from '$lib/auth/plugins';

import { STEAM_API_KEY, APP_SECRET, DISCORD_CLIENT_SECRET } from '$app/env/private';
import { URL, DISCORD_CLIENT_ID } from '$app/env/public';
import { getRequestEvent } from '$app/server';

const auth = betterAuth({
	baseURL: URL,
	secret: APP_SECRET,
	trustedOrigins: [URL!],
	plugins: [
		steamOpenId({
			steamApiKey: STEAM_API_KEY ?? '',
			failureRedirect: '/auth/fail',
			successRedirect: '/',
			allowSignIn: false
		}),
		sveltekitCookies(getRequestEvent)
	],
	advanced: {
		useSecureCookies: true,
		cookiePrefix: 'namepending'
	},
	socialProviders: {
		discord: {
			clientId: DISCORD_CLIENT_ID ?? '',
			clientSecret: DISCORD_CLIENT_SECRET
		}
	}
});

export default auth;
export type Auth = typeof auth;
