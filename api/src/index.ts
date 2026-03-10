import { Hono } from 'hono';
import app from '@routes/index.ts';

const app = new Hono();

app.route('/', app);

process.on('SIGINT', () => {
	console.log('Shutting down');
	process.exit();
});

export default app;
