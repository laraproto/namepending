import { createMiddleware } from 'hono/factory';
import { auth } from '@/modules/auth';
import db, { schema } from '@modules/db';
import type { ServerSelect } from '@modules/db/schema';
import * as token from '@modules/token';

const sessionMiddleware = createMiddleware<{
	Variables: {
		session: typeof auth.$Infer.Session.session | null;
		user: schema.UserSelect | null;
		server: ServerSelect | null;
	};
}>(async (c, next) => {
	const authHeader = c.req.header('Authorization');

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
			await next();
			return;
		}

		case 'Server': {
			if (authToken === undefined) {
				await next();
				return;
			}
			// Server auth
			const server = await token.validateServerApiKey(authToken);

			if (server === null) {
				await next();
				return;
			}

			c.set('server', server);

			await next();
			return;
		}

		case undefined:
		case 'Bearer': {
			const session = await auth.api.getSession({ headers: c.req.raw.headers });
			if (!session) {
				c.set('user', null);
				c.set('session', null);
				await next();
				return;
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
				c.set('user', null);
				c.set('session', null);
				await next();
				return;
			}

			c.set('user', user);
			c.set('session', session.session);
		}
	}

	await next();
	return;
});

export default sessionMiddleware;
