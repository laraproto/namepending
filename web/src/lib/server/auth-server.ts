import { betterAuth } from 'better-auth';
import { sveltekitCookies } from 'better-auth/svelte-kit';

import { steamOpenId } from '@namepending/api/auth-plugins';

import { env } from '$env/dynamic/public';
import { getRequestEvent } from '$app/server';

const auth = betterAuth({
	baseURL: env.PUBLIC_URL,
	plugins: [steamOpenId(), sveltekitCookies(getRequestEvent)]
});

export default auth;
