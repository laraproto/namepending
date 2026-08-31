import type { GameGroupSelectMinimal, PanelGroupSelectMinimal } from '$lib/server/db/schema';
import db, { schema } from '$lib/server/db';
import { z } from 'zod';
import { permsProcedure, router } from '$lib/server/trpc';
import { count, desc, eq } from 'drizzle-orm';
import { roleFlagKeys, RoleFlags, type RoleFlagKeys } from '@namepending/shared/user';
import { colorSchema, permissionSchema } from '@namepending/shared/sl';
import * as token from '$lib/server/token';

export const administrationRouter = router({
	getPanelRole: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES'] })
		.input(z.object({ id: z.uuid() }))
		.query(async ({ input }) => {
			try {
				const role = await db.query.panelGroups.findFirst({
					where: (group, { eq }) => eq(group.uuid, input.id)
				});

				if (!role) {
					return {
						success: false,
						data: null,
						message: 'Panel role not found.'
					};
				}

				return {
					success: true,
					data: role,
					message: 'Panel role fetched successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while fetching the panel role.'
				};
			}
		}),
	getGameRole: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES'] })
		.input(z.object({ id: z.uuid() }))
		.query(async ({ input }) => {
			try {
				const role = await db.query.gameGroups.findFirst({
					where: (group, { eq }) => eq(group.uuid, input.id)
				});

				if (!role) {
					return {
						success: false,
						data: null,
						message: 'Game role not found.'
					};
				}

				return {
					success: true,
					data: role,
					message: 'Game role fetched successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while fetching the game role.'
				};
			}
		}),
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
	getGameRoles: permsProcedure.meta({ permissionsRequired: ['VIEW_ROLES'] }).query(async () => {
		try {
			const roles = await db.query.gameGroups.findMany({
				orderBy: [desc(schema.gameGroups.createdAt)]
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
		}),
	getServers: permsProcedure
		.meta({ permissionsRequired: 'MANAGE_SERVERS' })
		.input(
			z.object({
				query: z.string(),
				limit: z.int().min(1).max(100).default(10),
				page: z.int().min(1).default(1)
			})
		)
		.query(async ({ input }) => {
			const rowQuery = await db.select({ value: count() }).from(schema.servers);
			let totalServers = 0;

			if (rowQuery[0]) {
				totalServers = Number(rowQuery[0].value);
			}

			const pageCount = Math.max(1, Math.ceil(totalServers / input.limit));

			if (input.page > pageCount) {
				input.page = pageCount;
			}
			switch (true) {
				case z.uuid().safeParse(input.query).success: {
					const servers = await db.query.servers.findMany({
						orderBy: [desc(schema.servers.createdAt)],
						where: (server, { eq }) => eq(server.uuid, input.query),
						with: {
							creator: true
						},
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: servers,
						count: totalServers,
						pageCount
					};
				}
				default: {
					const servers = await db.query.servers.findMany({
						orderBy: [desc(schema.servers.createdAt)],
						where: (server, { ilike }) => ilike(server.description, `%${input.query}%`),
						with: {
							creator: true
						},
						limit: input.limit,
						offset: (input.page - 1) * input.limit
					});

					return {
						data: servers,
						count: totalServers,
						pageCount
					};
				}
			}
		}),
	addServer: permsProcedure
		.meta({ permissionsRequired: 'MANAGE_SERVERS' })
		.input(
			z.object({
				description: z.string().max(255)
			})
		)
		.mutation(async ({ input, ctx }) => {
			try {
				const serverToken = token.generateSessionToken();

				await token.createServerApiKey(serverToken, ctx.user.id, input.description);

				return {
					success: true,
					token: serverToken,
					message: "Server API Key created, save it now as it won't be shown again"
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					message: 'An error occurred while creating the server API key.'
				};
			}
		}),
	deleteServer: permsProcedure
		.meta({ permissionsRequired: 'MANAGE_SERVERS' })
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input }) => {
			try {
				await db.delete(schema.servers).where(eq(schema.servers.uuid, input.id));
				return {
					success: true,
					message: 'Server deleted successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					message: 'An error occurred while deleting the server.'
				};
			}
		}),
	addGameGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.mutation(async () => {
			try {
				const gameGroup = await db
					.insert(schema.gameGroups)
					.values({
						name: 'new group',
						description: 'new group description',
						permissions: []
					})
					.returning();

				if (!gameGroup[0]) {
					return {
						success: false,
						data: null,
						message: 'Failed to create the game group.'
					};
				}

				return {
					success: true,
					data: gameGroup[0],
					message: 'Game group created successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while creating the game group.'
				};
			}
		}),
	addPanelGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.mutation(async () => {
			try {
				const panelGroup = await db
					.insert(schema.panelGroups)
					.values({
						name: 'new group',
						description: 'new group description',
						permissions: 4n
					})
					.returning();

				if (!panelGroup[0]) {
					return {
						success: false,
						data: null,
						message: 'Failed to create the panel group.'
					};
				}

				return {
					success: true,
					data: panelGroup[0],
					message: 'Panel group created successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while creating the panel group.'
				};
			}
		}),
	editPanelGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.input(
			z.object({
				id: z.uuid(),
				name: z.string().max(80),
				description: z.string().max(400),
				permissions: z.array(roleFlagKeys),
				gameGroup: z.uuid().nullable()
			})
		)
		.mutation(async ({ input }) => {
			try {
				let gameGroup: GameGroupSelectMinimal | null = null;
				if (input.gameGroup) {
					gameGroup =
						(await db.query.gameGroups.findFirst({
							//@ts-expect-error types being stupid
							where: (group, { eq }) => eq(group.uuid, input.gameGroup)
						})) ?? null;

					if (!gameGroup) {
						return {
							success: false,
							data: null,
							message: 'Game group not found.'
						};
					}
				}
				const permValue: bigint =
					input.permissions.reduce((acc, perm) => {
						return acc | (RoleFlags[perm as RoleFlagKeys] as bigint);
					}, 4n) | 4n;

				const updatedGroup = await db
					.update(schema.panelGroups)
					.set({
						name: input.name,
						description: input.description,
						permissions: permValue,
						gameGroupId: gameGroup?.uuid ?? null
					})
					.where(eq(schema.panelGroups.uuid, input.id))
					.returning();

				if (!updatedGroup[0]) {
					return {
						success: false,
						data: null,
						message: 'Failed to update the panel group.'
					};
				}

				return {
					success: true,
					data: updatedGroup[0],
					message: 'Panel group updated successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while updating the panel group.'
				};
			}
		}),
	editGameGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.input(
			z.object({
				id: z.uuid(),
				name: z.string().max(80),
				description: z.string().max(400),
				color: colorSchema.default('green'),
				permissions: z.array(permissionSchema)
			})
		)
		.mutation(async ({ input }) => {
			try {
				const updatedGroup = await db
					.update(schema.gameGroups)
					.set({
						name: input.name,
						description: input.description,
						color: input.color,
						permissions: input.permissions
					})
					.where(eq(schema.gameGroups.uuid, input.id))
					.returning();

				if (!updatedGroup[0]) {
					return {
						success: false,
						data: null,
						message: 'Failed to update the game group.'
					};
				}

				return {
					success: true,
					data: updatedGroup[0],
					message: 'Game group updated successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while updating the game group.'
				};
			}
		}),
	deletePanelGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'DELETE_ROLES'] })
		.input(z.object({ id: z.uuid() }))
		.mutation(async ({ input }) => {
			try {
				const deleted = await db
					.delete(schema.panelGroups)
					.where(eq(schema.panelGroups.uuid, input.id))
					.returning();

				if (!deleted[0]) {
					return {
						success: false,
						message: 'Failed to delete the panel group.'
					};
				}

				return {
					success: true,
					message: 'Panel group deleted successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while deleting the panel group.'
				};
			}
		}),
	deleteGameGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'DELETE_ROLES'] })
		.input(z.object({ id: z.uuid() }))
		.mutation(async ({ input }) => {
			try {
				const deleted = await db
					.delete(schema.gameGroups)
					.where(eq(schema.gameGroups.uuid, input.id))
					.returning();

				if (!deleted[0]) {
					return {
						success: false,
						message: 'Failed to delete the game group.'
					};
				}

				return {
					success: true,
					message: 'Game group deleted successfully.'
				};
			} catch (err) {
				console.error(err);
				return {
					success: false,
					data: null,
					message: 'An error occurred while deleting the game group.'
				};
			}
		})
});
