import { builder } from '@modules/yoga/builder';

import type {
	UserSelect,
	UserSelectMinimal,
	PanelGroupSelect,
	GameGroupSelectMinimal,
	BansSelect,
	WarnsSelect,
	ServerSelect,
	PlayerSelectMinimal
} from '@modules/db/schema';
import * as dbschema from '@modules/db/schema';
import db from '@modules/db';
import type { LookupOutput, LinkOutput } from './types';
import { BanType, WarnType } from './types';
import * as token from '@modules/token';

const GroupRef = builder.objectRef<PanelGroupSelect>('Group');
const GameGroupRef = builder.objectRef<GameGroupSelectMinimal>('GameGroup');
const UserRef = builder.objectRef<UserSelect>('User');
const UserMinimalRef = builder.objectRef<UserSelectMinimal>('UserMinimal');
const PlayerMinimalRef = builder.objectRef<PlayerSelectMinimal>('PlayerMinimal');
const ServerRef = builder.objectRef<ServerSelect>('Server');
const BanRef = builder.objectRef<BansSelect>('Ban');
const WarnRef = builder.objectRef<WarnsSelect>('Warn');

const LookupOutputRef = builder.objectRef<LookupOutput>('LookupOutput');
const LinkOutputRef = builder.objectRef<LinkOutput>('LinkOutput');

const BanTypeRef = builder.enumType(BanType, {
	name: 'BanType'
});

const WarnTypeRef = builder.enumType(WarnType, {
	name: 'WarnType'
});

const BanInputRef = builder.inputType('BanInput', {
	fields: (t) => ({
		author: t.string({
			required: true
		}),
		target: t.string({
			required: true
		}),
		reason: t.string({
			required: true
		}),
		duration: t.int({
			required: false
		}),
		type: t.field({
			type: BanTypeRef,
			required: true
		})
	})
});

const WarnInputRef = builder.inputType('WarnInput', {
	fields: (t) => ({
		author: t.string({
			required: true
		}),
		target: t.string({
			required: true
		}),
		reason: t.string({
			required: true
		}),
		duration: t.int({
			required: false
		}),
		type: t.field({
			type: WarnTypeRef,
			required: true
		})
	})
});

BanRef.implement({
	description: 'A ban',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		author: t.field({
			type: UserRef,
			resolve: (ban) => ban.banAuthor
		}),
		victim: t.field({
			type: PlayerMinimalRef,
			resolve: (ban) => ban.banVictim
		}),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'Date'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: BanTypeRef,
			resolve: (ban) => ban.type as BanType
		}),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		})
	})
});

WarnRef.implement({
	description: 'A warn',
	fields: (t) => ({
		id: t.exposeID('uuid'),
		author: t.field({
			type: UserRef,
			resolve: (warn) => warn.warnAuthor
		}),
		victim: t.field({
			type: PlayerMinimalRef,
			resolve: (warn) => warn.warnVictim
		}),
		reason: t.exposeString('reason'),
		expires: t.expose('expiresAt', {
			type: 'Date'
		}),
		active: t.exposeBoolean('active'),
		type: t.field({
			type: WarnTypeRef,
			resolve: (warn) => warn.type as WarnType
		}),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		})
	})
});

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
		}),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		})
	})
});

UserMinimalRef.implement({
	description: 'A user with minimal information',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id'),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		})
	})
});

GroupRef.implement({
	description: 'A group',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('uuid'),
		description: t.exposeString('description'),
		permissions: t.field({
			type: 'BigInt',
			resolve: (group) => group.permissions
		}),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		}),
		gameGroup: t.field({
			type: GameGroupRef,
			resolve: (group) => group.gameGroup
		})
	})
});

GameGroupRef.implement({
	description: 'A game group',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('uuid'),
		description: t.exposeString('description'),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
		}),
		permissions: t.exposeStringList('permissions')
	})
});

PlayerMinimalRef.implement({
	description: 'A player with minimal information',
	fields: (t) => ({
		name: t.exposeString('name'),
		platformId: t.exposeString('platformId'),
		id: t.exposeID('uuid'),
		doNotTrack: t.exposeBoolean('doNotTrack'),
		userId: t.exposeID('userId'),
		created: t.expose('createdAt', {
			type: 'Date'
		}),
		updated: t.expose('updatedAt', {
			type: 'Date'
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
		id: t.exposeID('uuid'),
		created: t.expose('createdAt', {
			type: 'Date'
		})
	})
});

builder.queryType({
	fields: (t) => ({
		self: t.field({
			type: UserRef,
			resolve: (_root, _args, ctx) => ctx.user
		}),
		server: t.field({
			type: ServerRef,
			resolve: (_root, _args, ctx) => ctx.server
		}),
		warns: t.field({
			type: [WarnRef],
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!targetQuery) {
						return [];
					}

					const warns = await db.query.playerWarns.findMany({
						where: (warn, { eq }) => eq(warn.victimId, targetQuery.uuid),
						with: {
							warnAuthor: {
								with: {
									group: {
										with: {
											gameGroup: true
										}
									},
									players: true
								}
							},
							warnVictim: true
						}
					});

					return warns;
				} catch (err) {
					console.error(err);
					return [];
				}
			}
		}),
		bans: t.field({
			type: [BanRef],
			authScopes: {
				server: true
			},
			args: {
				platformId: t.arg.string({
					required: true
				})
			},
			resolve: async (_root, args) => {
				try {
					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.platformId)
					});

					if (!targetQuery) {
						return [];
					}

					const bans = await db.query.playerBans.findMany({
						where: (ban, { eq }) => eq(ban.victimId, targetQuery.uuid),
						with: {
							banAuthor: {
								with: {
									group: {
										with: {
											gameGroup: true
										}
									},
									players: true
								}
							},
							banVictim: true
						}
					});

					return bans;
				} catch (err) {
					console.error(err);
					return [];
				}
			}
		})
	})
});

builder.mutationType({
	fields: (t) => ({
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

					if (playerQuery[0]) {
						await db
							.insert(dbschema.playerStats)
							.values({
								playerId: playerQuery[0].uuid
							})
							.returning();
					}

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
				input: t.arg({
					type: BanInputRef,
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
									.where(eq(dbschema.player.platformId, args.input.author))
							)
					});

					if (!userQuery) {
						return false;
					}

					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.input.target)
					});

					if (!targetQuery) {
						return false;
					}

					const ban = await db
						.insert(dbschema.playerBans)
						.values({
							authorId: userQuery.id,
							victimId: targetQuery.uuid,
							reason: args.input.reason,
							expiresAt: args.input.duration
								? new Date(Date.now() + args.input.duration * 1000)
								: new Date(),
							type: args.input.type,
							active: true
						})
						.returning();

					return ban.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		}),
		createWarn: t.boolean({
			authScopes: {
				server: true
			},
			args: {
				input: t.arg({
					type: WarnInputRef,
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
									.where(eq(dbschema.player.platformId, args.input.author))
							)
					});

					if (!userQuery) {
						return false;
					}

					const targetQuery = await db.query.player.findFirst({
						where: (player, { eq }) => eq(player.platformId, args.input.target)
					});

					if (!targetQuery) {
						return false;
					}

					const warn = await db
						.insert(dbschema.playerWarns)
						.values({
							authorId: userQuery.id,
							victimId: targetQuery.uuid,
							reason: args.input.reason,
							expiresAt: args.input.duration
								? new Date(Date.now() + args.input.duration * 1000)
								: new Date(),
							type: args.input.type,
							active: true
						})
						.returning();

					return warn.length > 0;
				} catch (err) {
					console.error(err);
					return false;
				}
			}
		})
	})
});

export const schema = builder.toSchema();
