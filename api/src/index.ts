import { Hono } from 'hono';
import apiRouter from '@routes/index.ts';

const app = new Hono();

app.route('/', apiRouter);

process.on('SIGINT', () => {
	console.log('Shutting down');
	process.exit();
});

export default app;
