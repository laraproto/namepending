import type { AppRouter } from '@namepending/api/trpc';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { env } from '$env/dynamic/public';
import superjson from 'superjson';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${env.PUBLIC_URL}/api/trpc`,
			transformer: superjson
		})
	]
});

export default trpc;
