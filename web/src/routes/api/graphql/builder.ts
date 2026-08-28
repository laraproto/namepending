import SchemaBuilder from '@pothos/core';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import { DateResolver, BigIntResolver, DateTimeResolver } from 'graphql-scalars';
import { type PermRequired, hasPermSync } from '$lib/perm-utils';

import type { RequestEvent } from '@sveltejs/kit';

export const builder = new SchemaBuilder<{
	Context: RequestEvent;
	AuthScopes: {
		user: boolean;
		server: boolean;
		perm: PermRequired;
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
		DateTime: {
			Input: Date;
			Output: Date;
		};
	};
}>({
	plugins: [ScopeAuthPlugin],
	scopeAuth: {
		authorizeOnSubscribe: true,
		authScopes: async (context) => ({
			user: !!context.locals.user,
			server: !!context.locals.server,
			perm: (perm) => (context.locals.user ? hasPermSync(context.locals.user, perm) : false)
		})
	}
});

builder.addScalarType('Date', DateResolver);
builder.addScalarType('DateTime', DateTimeResolver);
builder.addScalarType('BigInt', BigIntResolver);

import('./index');
