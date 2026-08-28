import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
	schema: 'http://localhost:5173/api/graphql',
	config: {
		scalars: {
			Date: 'Date',
			DateTime: 'Date',
			BigInt: 'bigint'
		}
	},
	importExtension: '.ts',
	generates: {
		'schema.graphql': {
			plugins: ['schema-ast']
		}
	}
};
export default config;
