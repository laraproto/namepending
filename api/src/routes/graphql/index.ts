import builder from '@modules/yoga';

import type {
	UserSelect,
	UserSelectMinimal,
	PanelGroupSelect,
	ServerSelect
} from '@modules/db/schema';

const GroupRef = builder.objectRef<PanelGroupSelect>('Group');
const UserRef = builder.objectRef<UserSelect>('User');
const UserMinimalRef = builder.objectRef<UserSelectMinimal>('UserMinimal');
const ServerRef = builder.objectRef<ServerSelect>('Server');

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
		})
	})
});

export const schema = builder.toSchema();
