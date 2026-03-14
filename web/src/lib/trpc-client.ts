import type { AppRouter } from '@namepending/api/trpc';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { env } from '$env/dynamic/public';
import superjson from 'superjson';

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.PUBLIC_URL}/api/trpc`,
			transformer: superjson
		})
	]
});

export default trpc;
