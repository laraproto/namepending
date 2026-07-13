import { Hono } from 'hono';
import { websocket } from 'hono/bun';
import { showRoutes } from 'hono/dev';
import apiRouter from '@routes/index.ts';
import '@modules/cron';
import { HOST } from './modules/config';

const app = new Hono();

app.route('/', apiRouter);

process.on('SIGINT', () => {
	console.log('Shutting down');
	process.exit();
});

showRoutes(app);

export default {
	...app,
	websocket,
	hostname: HOST
};
