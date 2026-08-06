import type { AppRouter } from '$routes/api/trpc';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { createTRPCClient, httpBatchLink, TRPCClientError } from '@trpc/client';
import { URL } from '$app/env/public';
import superjson from 'superjson';

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;

export function isTRPCClientError(cause: unknown): cause is TRPCClientError<AppRouter> {
	return cause instanceof TRPCClientError;
}

const trpc = createTRPCClient<AppRouter>({
	links: [
		httpBatchLink({
			url: `${URL}/api/trpc`,
			transformer: superjson
		})
	]
});

export default trpc;
