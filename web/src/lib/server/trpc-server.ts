import type { AppRouter } from '@namepending/api/trpc';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { env } from '$env/dynamic/public';
import superjson from 'superjson';
import { getRequestEvent } from '$app/server';

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.PUBLIC_URL}/api/trpc`,
			transformer: superjson,
			headers() {
				return {
					Authorization: getRequestEvent().cookies.get('__Secure-namepending.session_token')
				};
			}
		})
	]
});

export default trpc;
