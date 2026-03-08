import { Hono } from 'hono';

const router = new Hono().basePath('/api');

router.get('/', (c) => {
	return c.text('Test route');
});

export default router;
