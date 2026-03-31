import { authedProcedure, publicProcedure, router } from '@modules/trpc';
import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';
import { z } from 'zod';
import { panelRouter } from './panel';

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
	panel: panelRouter
});

export type AppRouter = typeof appRouter;
