import { Hono } from 'hono';
import apiRouter from '@routes/index.ts';
import '@modules/cron';

const app = new Hono();

app.route('/', apiRouter);

process.on('SIGINT', () => {
	console.log('Shutting down');
	process.exit();
});

export default app;
