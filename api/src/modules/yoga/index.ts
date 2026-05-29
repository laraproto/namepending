import { createYoga } from 'graphql-yoga';
import { schema } from '@routes/graphql';

import { auth } from '@modules/auth';
import type { UserSelect, ServerSelect } from '@modules/db/schema';

// Create a Yoga instance with a GraphQL schema.
export const yoga = createYoga<{
	user: UserSelect | null;
	server: ServerSelect | null;
	session: typeof auth.$Infer.Session.session | null;
}>({ schema, graphqlEndpoint: '/api/graphql', landingPage: false });
