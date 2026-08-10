import { initTRPC, TRPCError } from '@trpc/server';

import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';

import auth from '$lib/server/auth';
import superjson from 'superjson';
import type { UserSelect } from '$lib/server/db/schema';
import type { Cookies } from '@sveltejs/kit';

export type CookieSetOptions = Parameters<Cookies['set']>[2];
export type CookieGetOptions = Parameters<Cookies['get']>[1];
export type CookieDeleteOptions = Parameters<Cookies['delete']>[1];

interface TRPCContext {
	session: typeof auth.$Infer.Session.session | null;
	user: UserSelect | null;
	setCookie: (name: string, value: string, options: CookieSetOptions) => void;
	getCookie: (name: string, options?: CookieGetOptions) => string | undefined;
	deleteCookie: (name: string, options: CookieDeleteOptions) => void;
}

interface Meta {
	permissionsRequired?:
		| JointFlagKeys
		| JointFlagKeys[]
		| bigint
		| ((ctx: TRPCContext, input: unknown) => Promise<boolean>);
}

const t = initTRPC.context<TRPCContext>().meta<Meta>().create({
	transformer: superjson
});

export const router = t.router;
export const publicProcedure = t.procedure;

export const authedProcedure = publicProcedure.use(async (opts) => {
	const { ctx } = opts;

	if (!ctx.session || !ctx.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to access this resource.'
		});
	}

	return opts.next({
		ctx: {
			...ctx,
			user: ctx.user,
			session: ctx.session
		}
	});
});

export const permsProcedure = authedProcedure.use(async (opts) => {
	const { ctx, meta } = opts;

	if (!ctx.session || !ctx.user) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'You must be logged in to access this resource.'
		});
	}

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
			if (await meta.permissionsRequired(ctx, await opts.getRawInput())) break;
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
