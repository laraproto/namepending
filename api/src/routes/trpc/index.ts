import { authedProcedure, publicProcedure, router } from '@modules/trpc';
import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';
import { z } from 'zod';
import { panelRouter } from './panel';
import db, { schema } from '@modules/db';
import { count, or, ilike, isNotNull, and } from 'drizzle-orm';

export const appRouter = router({
	config: publicProcedure.query(async () => {
		const config = await db.query.config.findFirst({});

		return {
			steam: !!config?.dynamic.steam_api_key,
			discord: !!config?.dynamic.oauth?.discord
		};
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
	listStaff: publicProcedure
		.input(
			z.object({
				query: z.string(),
				limit: z.number().min(1).max(100).default(10),
				page: z.number().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			const rowQuery = await db
				.select({ value: count() })
				.from(schema.user)
				.where(
					and(
						or(
							ilike(schema.user.name, `%${input.query}%`),
							ilike(schema.user.id, `%${input.query}%`)
						),
						isNotNull(schema.user.groupId)
					)
				);
			let totalStaff = 0;

			if (rowQuery[0]) {
				totalStaff = Number(rowQuery[0].value);
			}

			const pageCount = Math.max(1, Math.ceil(totalStaff / input.limit));

			if (input.page > pageCount) {
				input.page = pageCount;
			}

			const staff = await db.query.user.findMany({
				where: (user, { isNotNull, ilike, or, and }) =>
					and(
						or(ilike(user.name, `%${input.query}%`), ilike(user.id, `%${input.query}%`)),
						isNotNull(user.groupId)
					),
				columns: {
					email: false,
					emailVerified: false,
					flags: false,
					image: false
				},
				with: {
					group: {
						columns: {
							permissions: false
						}
					}
				},
				limit: input.limit,
				offset: (input.page - 1) * input.limit,
				orderBy: (user, { desc }) => desc(user.createdAt)
			});

			return {
				data: staff,
				count: totalStaff,
				pageCount
			};
		}),
	panel: panelRouter
});

export type AppRouter = typeof appRouter;
