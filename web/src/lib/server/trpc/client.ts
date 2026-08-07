import type { AppRouter } from '$routes/api/trpc';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { URL } from '$app/env/public';
import superjson from 'superjson';
import { getRequestEvent } from '$app/server';

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${URL}/api/trpc`,
			transformer: superjson,
			headers() {
				const event = getRequestEvent();
				event.request.headers.delete('content-type');
				return event.request.headers;
			}
		})
	]
});

export default trpc;
