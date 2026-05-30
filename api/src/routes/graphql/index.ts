import { builder } from '@modules/yoga/builder';

import type {
	UserSelect,
	UserSelectMinimal,
	PanelGroupSelect,
	ServerSelect
} from '@modules/db/schema';
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
				userId: t.arg.string({
					required: true
				}),
				userIp: t.arg.string({
					required: false
				})
			},
			resolve: async (root, args) => {
				try {
					const key = token.generateSessionToken();
					const lookup = await token.createLookupKey(key, args.userId);

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
				userId: t.arg.string({
					required: true
				})
			},
			resolve: async (root, args) => {
				try {
					const key = token.createAccountLinkCode();
					const link = await token.createLinkEntry(key, args.userId);

					return {
						key,
						expires: link.expiresAt
					};
				} catch (err) {
					console.error(err);
					return null;
				}
			}
		})
	})
});

export const schema = builder.toSchema();
