import { createYoga } from 'graphql-yoga';
import { schema } from '@routes/graphql';

// Create a Yoga instance with a GraphQL schema.
export const yoga = createYoga({ schema, graphqlEndpoint: '/api/graphql', landingPage: false });
