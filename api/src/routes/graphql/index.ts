import { builder } from '@modules/yoga/builder';

import type {
	UserSelect,
	UserSelectMinimal,
	PanelGroupSelect,
	ServerSelect
} from '@modules/db/schema';
import * as dbschema from '@modules/db/schema';
import db from '@modules/db';
import type { LookupOutput, LinkOutput } from './types';
import * as token from '@modules/token';

const GroupRef = builder.objectRef<PanelGroupSelect>('Group');
const UserRef = builder.objectRef<UserSelect>('User');
const UserMinimalRef = builder.objectRef<UserSelectMinimal>('UserMinimal');
const ServerRef = builder.objectRef<ServerSelect>('Server');

const LookupOutputRef = builder.objectRef<LookupOutput>('LookupOutput');
const LinkOutputRef = builder.objectRef<LinkOutput>('LinkOutput');

LookupOutputRef.implement({
	description: 'Output of lookup key creation',
	fields: (t) => ({
		key: t.exposeString('key'),
		expires: t.expose('expires', {
			type: 'Date'
		})
	})
});

LinkOutputRef.implement({
	description: 'Output of account link key creation',
	fields: (t) => ({
		key: t.exposeString('key'),
		expires: t.expose('expires', {
			type: 'Date'
		})
	})
});

UserRef.implement({
	description: 'A user',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id'),
		group: t.field({
			type: GroupRef,
			resolve: (user) => user.group
		})
	})
});

UserMinimalRef.implement({
	description: 'A user with minimal information',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id')
	})
});

GroupRef.implement({
	description: 'A group',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('uuid'),
		description: t.exposeString('description'),
		permissions: t.field({
			type: 'Int',
			resolve: (group) => Number(group.permissions)
		})
	})
});

ServerRef.implement({
	description: 'A server',
	fields: (t) => ({
		description: t.exposeString('description'),
		creator: t.field({
			type: UserMinimalRef,
			resolve: (server) => server.creator
		}),
		id: t.exposeID('uuid')
	})
});

builder.queryType({
	fields: (t) => ({
		hello: t.string({
			resolve: () => 'world'
		}),
		self: t.field({
			type: UserRef,
			resolve: (_root, _args, ctx) => ctx.user
		}),
		server: t.field({
			type: ServerRef,
			resolve: (_root, _args, ctx) => ctx.server
		})
	})
});

builder.mutationType({
	fields: (t) => ({
		// Add mutation that returns a simple boolean
		post: t.boolean({
			authScopes: {
				user: true,
				server: true
			},
			args: {
				message: t.arg.string()
			},
			resolve: async (root, args) => {
				// Do something with the message
				console.log(args);
				return true;
			}
		}),
		createLookup: t.field({
			type: LookupOutputRef,
			authScopes: {
				server: true
			},
			nullable: true,
			args: {
				platformId: t.arg.string({
					required: true
				}),
				userIp: t.arg.string({
					required: false
				})
			},
			resolve: async (_root, args) => {
				try {
					const key = token.generateSessionToken();
					const lookup = await token.createLookupKey(key, args.platformId);

					return {
						key,
						expires: lookup.expiresAt
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		createAccountLink: t.field({
			type: LinkOutputRef,
			authScopes: {
				server: true
			},
			nullable: true,
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const key = token.createAccountLinkCode();
					const link = await token.createLinkEntry(key, args.platformId);

					return {
						key,
						expires: link.expiresAt
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		}),
		createPlayer: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				}),
				name: t.arg.string({
					required: true
				}),
				doNotTrack: t.arg.boolean({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const playerQuery = await db
						.insert(dbschema.player)
						.values({
							platformId: args.platformId,
							name: args.name,
							doNotTrack: args.doNotTrack
						})
						.returning();

					return playerQuery.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}),
		createBan: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				author: t.arg.string({
					required: true
				}),
				target: t.arg.string({
					required: true
				}),
				reason: t.arg.string({
					required: true
				}),
				duration: t.arg.int({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const userQuery = await db.query.user.findFirst({
						where: (user, { eq, inArray }) =>
							inArray(
								user.id,
								db
									.select({ id: dbschema.player.uuid })
									.from(dbschema.player)
									.where(eq(dbschema.player.platformId, args.author))
							)
					});

					if (!userQuery) {
						return false;
					}

					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.target)
					});

					if (!targetQuery) {
						return false;
					}

					const ban = await db
						.insert(dbschema.playerBans)
						.values({
							authorId: userQuery.id,
							victimId: targetQuery.uuid,
							reason: args.reason,
							expiresAt: new Date(Date.now() + args.duration * 1000),
							type: args.duration === 0 ? 'permanent' : 'temporary',
							active: true
						})
						.returning();

					return ban.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		})
	})
});

export const schema = builder.toSchema();
