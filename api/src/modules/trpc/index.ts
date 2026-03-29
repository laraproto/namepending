import { initTRPC, TRPCError } from '@trpc/server';

import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';

import { auth } from '@modules/auth';
import superjson from 'superjson';

interface TRPCContext {
	session: typeof auth.$Infer.Session;
	user: (typeof auth.$Infer.Session)['user'];
}

interface Meta {
	permissionsRequired?: JointFlagKeys | JointFlagKeys[] | ((ctx: TRPCContext) => Promise<boolean>);
}

const t = initTRPC.context<TRPCContext>().meta<Meta>().create({
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

export const permsProcedure = authedProcedure.use(async (opts) => {
	const { ctx, meta } = opts;

	if ((ctx.user.flags & JointFlags.SUPERADMIN) !== 0n) {
		return opts.next({
			ctx
		});
	}

	if (!meta) {
		throw new TRPCError({
			code: 'FORBIDDEN'
		});
	}

	switch (typeof meta.permissionsRequired) {
		case 'string': {
			const mask = JointFlags[meta.permissionsRequired];
			if (
				(ctx.user.group !== null && (ctx.user.group?.permissions & mask) !== 0n) ||
				(ctx.user.flags & mask) !== 0n
			)
				break;
			throw new TRPCError({ code: 'FORBIDDEN' });
		}
		case 'object': {
			if (!Array.isArray(meta.permissionsRequired)) break; // Fail open for objects that aren't arrays, to stay in line with default case

			let finalMask = 0n;
			for (const perm of meta.permissionsRequired) {
				const mask = JointFlags[perm];
				finalMask |= mask;
			}

			if (
				(ctx.user.group !== null && (ctx.user.group?.permissions & finalMask) !== 0n) ||
				(ctx.user.flags & finalMask) !== 0n
			)
				break;
			throw new TRPCError({ code: 'FORBIDDEN' });
		}
		case 'function': {
			if (await meta.permissionsRequired(ctx)) break;
			throw new TRPCError({ code: 'FORBIDDEN' });
		}
		case 'bigint': {
			// Flag names preferred!
			if (
				(ctx.user.group !== null &&
					(ctx.user.group?.permissions & meta.permissionsRequired) !== 0n) ||
				(ctx.user.flags & meta.permissionsRequired) !== 0n
			)
				break;
			throw new TRPCError({ code: 'FORBIDDEN' });
		}
		default: {
			break; // Fail open for any other type
		}
	}

	return opts.next({
		ctx
	});
});
