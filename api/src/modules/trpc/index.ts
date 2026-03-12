import { initTRPC } from '@trpc/server';

import { auth } from '@modules/auth';
import superjson from 'superjson';

interface TRPCContext {
	session: typeof auth.$Infer.Session;
	user: (typeof auth.$Infer.Session)['user'];
}

const t = initTRPC.context<TRPCContext>().create({
	transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = publicProcedure.use(async (opts) => {
	const { ctx } = opts;

	return opts.next({
		ctx
	});
});
