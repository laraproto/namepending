import authServer from '$lib/server/auth-server';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const session = await authServer.getSession();

	if (session.error) {
		console.error('Error fetching session:', session.error);
	}

	if (session.data) {
		event.locals.session = session.data.session;
		event.locals.user = session.data.user;
	} else {
		event.locals.session = null;
		event.locals.user = null;
	}

	const response = await resolve(event);
	return response;
};
