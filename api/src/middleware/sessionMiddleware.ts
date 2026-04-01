import { createMiddleware } from 'hono/factory';
import { auth } from '@/modules/auth';
import db, { schema } from '@modules/db';

const sessionMiddleware = createMiddleware<{
	Variables: {
		session: typeof auth.$Infer.Session.session | null;
		user: schema.UserSelect | null;
	};
}>(async (c, next) => {
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
	await next();
});

export default sessionMiddleware;
