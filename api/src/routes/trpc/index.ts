import { authedProcedure, publicProcedure, router } from '@modules/trpc';
import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';
import { z } from 'zod';
import { panelRouter } from './panel';
import db from '@modules/db';

export const appRouter = router({
	hello: publicProcedure
		.input(
			z.object({
				name: z.string().nullish()
			})
		)
		.output(z.string())
		.query(({ input }) => {
			return `Hello ${input.name ?? 'world'}`;
		}),
	permsDebug: authedProcedure.query(({ ctx }) => {
		const flagList: { [key in JointFlagKeys]: boolean } = {} as { [key in JointFlagKeys]: boolean };
		for (const flag in JointFlags) {
			const flagValue = JointFlags[flag as JointFlagKeys];

			const hasFlag = !!(
				(ctx.user!.flags & flagValue) === flagValue ||
				(ctx.user?.group && (ctx.user?.group?.permissions & flagValue) === flagValue)
			);
			flagList[flag as JointFlagKeys] = hasFlag;
		}

		return flagList;
	}),
	getSelf: authedProcedure.query(async ({ ctx }) => {
		return ctx.user;
	}),
	listStaff: publicProcedure.input(z.string()).query(async ({ input }) => {
		const staff = await db.query.user.findMany({
			where: (user, { isNotNull, ilike, or, and }) =>
				and(
					or(ilike(user.name, `%${input}%`), ilike(user.id, `%${input}%`)),
					isNotNull(user.groupId)
				),
			columns: {
				email: false,
				emailVerified: false,
				flags: false,
				image: false
			},
			with: {
				group: true
			}
		});

		return staff;
	}),
	panel: panelRouter
});

export type AppRouter = typeof appRouter;
