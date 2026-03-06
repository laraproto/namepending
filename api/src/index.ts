import { Hono } from 'hono';
import router from '@routes/index.ts';

const app = new Hono();

app.get('/', (c) => {
	return c.text('Go away!');
});

app.route('/', router);

export default app;
