import db from '@modules/db';
import { permsProcedure, router } from '@modules/trpc';
import { JointFlags } from '@namepending/shared/user';
import { z } from 'zod';

export const panelRouter = router({
	hello: permsProcedure
		.meta({
			permissionsRequired: 'VIEW_USERS'
		})
		.input(
			z.object({
				name: z.string().nullish()
			})
		)
		.output(z.string())
		.query(async ({ input }) => {
			return `Hello ${input.name ?? 'world'}, you've got the VIEW_USERS flag`;
		}),
	getProfile: permsProcedure
		.meta({
			permissionsRequired: async (ctx, input: unknown) => {
				if (
					(ctx.user!.group !== null &&
						(ctx.user!.group?.permissions & JointFlags.VIEW_USERS) !== 0n) ||
					(ctx.user!.flags & JointFlags.VIEW_USERS) !== 0n ||
					input === ctx.user!.id
				)
					return true;
				return false;
			}
		})
		.input(z.string())
		.query(async ({ ctx, input }) => {
			if (input === ctx.user.id) {
				return ctx.user;
			}

			const user = await db.query.user.findFirst({
				where: (user, { eq }) => eq(user.id, input),
				with: {
					group: true
				},
				columns: {
					email: false
				}
			});

			if (!user) {
				return null;
			}

			return user;
		})
});
