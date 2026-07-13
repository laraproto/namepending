import authServer from '$lib/server/auth-server';
import type { Handle } from '@sveltejs/kit';
import trpc from '$lib/server/trpc-server';
import { isTRPCClientError } from '$lib/trpc-client';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const session = await authServer.getSession();

		if (session.error) {
			console.error('Error fetching session:', session.error);
		}

		event.locals.config = await trpc.config.query();

		if (session.data) {
			event.locals.session = session.data.session;
			event.locals.user = session.data.user;
			event.locals.localUser = await trpc.getSelf.query();
		} else {
			event.locals.session = null;
			event.locals.user = null;
			event.locals.localUser = null;
		}

		const response = await resolve(event);
		return response;
	} catch (err) {
		if (isTRPCClientError(err) && err.data?.code === 'UNAUTHORIZED') {
			const response = await resolve(event);
			return response;
		} else {
			console.error('Error in handle function:', err);
			const response = await resolve(event);
			return response;
		}
	}
};
