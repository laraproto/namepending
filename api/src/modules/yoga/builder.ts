import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { DateResolver } from 'graphql-scalars';

import { auth } from '@modules/auth';
import type { UserSelect, ServerSelect } from '@modules/db/schema';

export const builder = new SchemaBuilder<{
	Context: {
		user: UserSelect | null;
		server: ServerSelect | null;
		session: typeof auth.$Infer.Session.session | null;
	};
	AuthScopes: {
		user: boolean;
		server: boolean;
	};
	Scalars: {
		Date: {
			Input: Date;
			Output: Date;
		};
	};
}>({
	plugins: [ScopeAuthPlugin],
	scopeAuth: {
		authorizeOnSubscribe: true,
		authScopes: async (context) => ({
			user: !!context.user,
			server: !!context.server
		})
	}
});

builder.addScalarType('Date', DateResolver);
