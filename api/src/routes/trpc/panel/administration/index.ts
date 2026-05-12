import type { PanelGroupSelectMinimal } from '@/modules/db/schema';
import db, { schema } from '@modules/db';
import { z } from 'zod';
import { permsProcedure, router } from '@modules/trpc';
import { desc, eq } from 'drizzle-orm';

export const administrationRouter = router({
	getPanelRoles: permsProcedure.meta({ permissionsRequired: ['VIEW_ROLES'] }).query(async () => {
		try {
			const roles = await db.query.panelGroups.findMany({
				orderBy: [desc(schema.panelGroups.createdAt)]
			});

			return {
				data: roles,
				count: roles.length,
				pageCount: 1
			};
		} catch (err) {
			console.error(err);
			return {
				data: [],
				count: 0,
				pageCount: 1
			};
		}
	}),
	setRole: permsProcedure
		.meta({
			permissionsRequired: ['VIEW_USERS', 'VIEW_ROLES', 'CREATE_EDIT_ROLES']
		})
		.input(
			z.object({
				user: z.string(),
				role: z.uuid().nullable()
			})
		)
		.mutation(async ({ input }) => {
			try {
				const user = await db.query.user.findFirst({
					where: (user, { eq }) => eq(user.id, input.user)
				});

				if (!user) {
					return {
						success: false,
						message: 'User not found.'
					};
				}

				let role: PanelGroupSelectMinimal | undefined = undefined;

				if (input.role !== null) {
					role = await db.query.panelGroups.findFirst({
						where: (group, { eq }) => eq(group.uuid, input.role!)
					});

					if (!role) {
						return {
							success: false,
							message: 'Role not found.'
						};
					}
				}

				const updatedUser = await db
					.update(schema.user)
					.set({ groupId: role?.uuid ?? null })
					.where(eq(schema.user.id, user.id))
					.returning();

				if (!updatedUser[0]) {
					return {
						success: false,
						message: 'Updated rows: 0'
					};
				}

				return {
					success: true,
					message: 'Role updated successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					message: 'An error occurred while setting the role.'
				};
			}
		})
});
