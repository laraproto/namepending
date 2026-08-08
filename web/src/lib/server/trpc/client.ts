import type { AppRouter } from '$routes/api/trpc';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import superjson from 'superjson';
import { getRequestEvent } from '$app/server';

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `/api/trpc`,
			fetch: (input: RequestInfo | URL | string, init?: RequestInit) =>
				getRequestEvent().fetch(input, init),
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
