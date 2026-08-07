import { auth } from '@modules/auth';
import { APP_URL } from '@modules/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import sessionMiddleware from '@middleware/sessionMiddleware';
import { appRouter } from '../../../web/src/routes/api/trpc';
import type { UserSelect, ServerSelect } from '@modules/db/schema';
import { yoga } from '@modules/yoga';
import { deleteCookie, getCookie, setCookie } from 'hono/cookie';
import type { CookieOptions } from 'hono/utils/cookie';

const app = new Hono<{
	Variables: {
		user: UserSelect | null;
		server: ServerSelect | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>().basePath('/api');

app.use('*', sessionMiddleware);

app.use(
	'/auth/*',
	cors({
		origin: APP_URL!,
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
);

app.use('/auth/*', (c) => {
	return auth.handler(c.req.raw);
});

app.use(
	'/trpc/*',
	cors({
		origin: APP_URL!,
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
);

app.use(
	'/trpc/*',
	trpcServer({
		endpoint: '/api/trpc',
		router: appRouter,
		createContext: (opts, c) => ({
			session: c.get('session'),
			user: c.get('user'),
			setCookie: (name: string, value: string, options: CookieOptions) =>
				setCookie(c, name, value, options),
			getCookie: (name: string) => getCookie(c, name),
			deleteCookie: (name: string, options?: CookieOptions) => deleteCookie(c, name, options)
		})
	})
);

app.use('/graphql/*', async (c) => {
	return yoga.handle({
		request: c.req.raw,
		session: c.get('session'),
		user: c.get('user'),
		server: c.get('server')
	});
});

export default app;
