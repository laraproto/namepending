import type { PanelGroupSelectMinimal } from '@/modules/db/schema';
import db, { schema } from '@modules/db';
import { z } from 'zod';
import { permsProcedure, router } from '@modules/trpc';
import { count, desc, eq } from 'drizzle-orm';
import * as token from '@modules/token';

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
	addGameGroup: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.input(
			z.object({
				name: z.string().max(80),
				description: z.string().max(400),
				permissions: z.array(z.string())
			})
		)
		.mutation(async ({ input }) => {
			try {
				const gameGroup = await db
					.insert(schema.gameGroups)
					.values({
						name: input.name,
						description: input.description,
						permissions: input.permissions
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
	addPanelRole: permsProcedure
		.meta({ permissionsRequired: ['VIEW_ROLES', 'CREATE_EDIT_ROLES'] })
		.input(z.object({
			name: z.string().max(80),
			description: z.string().max(400),
				permissions: z.array(jointF)
		))
		.mutation(async () => {})
});
