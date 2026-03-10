import { auth } from '@/modules/auth';
import { URL } from '@/modules/config';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono().basePath('/api');

app.use(
	'/api/auth/*', // or replace with "*" to enable cors for all routes
	cors({
		origin: URL!,
		allowHeaders: ['Content-Type', 'Authorization'],
		allowMethods: ['POST', 'GET', 'OPTIONS'],
		exposeHeaders: ['Content-Length'],
		maxAge: 600,
		credentials: true
	})
);
app.on(['POST', 'GET'], '/api/auth/*', (c) => {
	return auth.handler(c.req.raw);
});

export default app;
