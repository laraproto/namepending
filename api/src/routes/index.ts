import { auth } from '@/modules/auth';
import { APP_URL } from '@/modules/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { trpcServer } from '@hono/trpc-server';
import sessionMiddleware from '@middleware/sessionMiddleware';
import { appRouter } from './trpc';
import type { UserSelect } from '@/modules/db/schema';

const app = new Hono<{
	Variables: {
		user: UserSelect | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>().basePath('/api');

app.use('*', sessionMiddleware);

/* app.use(
	'/auth/*',
	cors({
		origin: URL!,
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
); */

app.on(['POST', 'GET'], '/auth/*', (c) => {
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
			user: c.get('user')
		})
	})
);

export default app;
