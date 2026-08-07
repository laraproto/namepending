import { createYoga } from 'graphql-yoga';
import type { RequestEvent } from '@sveltejs/kit';

// Create a Yoga instance with a GraphQL schema.
const yogaApp = createYoga<RequestEvent>({
	schema: (await import('$routes/api/graphql')).schema,
	graphqlEndpoint: '/api/graphql',
	landingPage: false,
	fetchAPI: { Response }
});

export { yogaApp as GET, yogaApp as POST, yogaApp as OPTIONS };
