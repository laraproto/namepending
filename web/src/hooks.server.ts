import '$lib/server/cron';
import auth from '$lib/server/auth';
import * as token from '$lib/server/token';

import { svelteKitHandler } from 'better-auth/svelte-kit';
import { building } from '$app/env';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import db from '$lib/server/db';

export const authHandle: Handle = async ({ event, resolve }) => {
	return await svelteKitHandler({ event, resolve, auth, building });
};

export const sessionHandle: Handle = async ({ event, resolve }) => {
	console.log(
		event.request.method,
		event.request.url,
		event.request.headers.get('X-Forwarded-For'),
		event.request.headers.get('X-Forwarded-Proto'),
		event.request.headers.get('X-Real-IP'),
		event.request.headers.get('X-Forwarded-Host')
	);
	try {
		const authHeader = event.request.headers.get('Authorization') ?? '';

		const authSplit = authHeader === undefined ? undefined : authHeader.split(' ', 2);
		const authMethod =
			authSplit?.length !== undefined && authSplit.length > 1 ? authSplit[0] : undefined;
		let authToken: string | undefined;

		if (authMethod === undefined && authSplit !== undefined && authSplit[0] !== undefined) {
			authToken = authSplit[0];
		} else if (authMethod !== undefined && authSplit !== undefined && authSplit[1] !== undefined) {
			authToken = authSplit[1];
		}

		switch (authMethod) {
			case 'Bot': {
				console.log('Attempt to use unimplemented bot authentication route');
				return await resolve(event);
			}

			case 'Server': {
				if (authToken === undefined) {
					return await resolve(event);
				}
				// Server auth
				const server = await token.validateServerApiKey(authToken);

				if (server === null) {
					return await resolve(event);
				}

				event.locals.server = server;

				return await resolve(event);
			}

			case undefined: {
				const session = await auth.api.getSession({ headers: event.request.headers });
				if (!session) {
					event.locals.user = null;
					event.locals.session = null;
					return await resolve(event);
				}

				const user = await db.query.user.findFirst({
					where: (user, { eq }) => eq(user.id, session.user.id),
					with: {
						group: {
							with: {
								gameGroup: true
							}
						},
						players: true
					}
				});

				if (!user) {
					event.locals.user = null;
					event.locals.session = null;
					return await resolve(event);
				}

				event.locals.user = user;
				event.locals.session = session.session;
			}
		}
		return await resolve(event);
	} catch (err) {
		console.error('Error in authHandle function:', err);
		const response = await resolve(event);
		return response;
	}
};

export const handle: Handle = sequence(sessionHandle, authHandle);
