import SchemaBuilder from '@pothos/core';

import { auth } from '@modules/auth';
import type { UserSelect } from '@modules/db/schema';

const builder = new SchemaBuilder<{
	Context: {
		user: UserSelect | null;
		session: typeof auth.$Infer.Session.session | null;
	};
}>({});

const UserRef = builder.objectRef<UserSelect>('User');

UserRef.implement({
	description: 'A user',
	fields: (t) => ({
		name: t.exposeString('name'),
		id: t.exposeID('id')
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
		})
	})
});

export const schema = builder.toSchema();
