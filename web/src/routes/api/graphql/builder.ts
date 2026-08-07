import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { DateResolver, BigIntResolver } from 'graphql-scalars';

import type { RequestEvent } from '@sveltejs/kit';

export const builder = new SchemaBuilder<{
	Context: RequestEvent;
	AuthScopes: {
		user: boolean;
		server: boolean;
	};
	Scalars: {
		Date: {
			Input: Date;
			Output: Date;
		};
		BigInt: {
			Input: bigint;
			Output: bigint;
		};
	};
}>({
	plugins: [ScopeAuthPlugin],
	scopeAuth: {
		authorizeOnSubscribe: true,
		authScopes: async (context) => ({
			user: !!context.locals.user,
			server: !!context.locals.server
		})
	}
});

builder.addScalarType('Date', DateResolver);
builder.addScalarType('BigInt', BigIntResolver);
