import { createMiddleware } from 'hono/factory';
import { auth } from '@/modules/auth';

const sessionMiddleware = createMiddleware<{
	Variables: {
		session: typeof auth.$Infer.Session.session | null;
		user: typeof auth.$Infer.Session.user | null;
	};
}>(async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
	if (!session) {
		c.set('user', null);
		c.set('session', null);
		await next();
		return;
	}
	c.set('user', session.user);
	c.set('session', session.session);
	await next();
});

export default sessionMiddleware;
