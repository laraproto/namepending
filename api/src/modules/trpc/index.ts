import { initTRPC, TRPCError } from '@trpc/server';

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

	if (!ctx.session || !ctx.session.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to access this resource.'
		});
	}

	return opts.next({
		ctx
	});
});
