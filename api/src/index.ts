import { Hono } from 'hono';
import router from '@routes/index.ts';

const app = new Hono();

app.get('/', (c) => {
	return c.text('Go away!');
});

app.route('/', router);

process.on('SIGINT', () => {
	console.log('Shutting down');
	process.exit();
});

export default app;
