import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { steamOpenId } from '$lib/auth/plugins';

import { STEAM_API_KEY, APP_SECRET, DISCORD_CLIENT_SECRET } from '$app/env/private';
import { URL as APP_URL, DISCORD_CLIENT_ID } from '$app/env/public';

import { getRequestEvent } from '$app/server';
import db from '$lib/server/db';

const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	baseURL: {
		allowedHosts: [new URL(APP_URL!).host]
	},
	secret: APP_SECRET,
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
