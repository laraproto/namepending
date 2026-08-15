import adapter from '@risk-tolerance/svelte-adapter-bun';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
    adapter: adapter({
      websockets: true,
		}),
		alias: {
			$routes: 'src/routes'
		},
		experimental: {
			remoteFunctions: true,
			explicitEnvironmentVariables: true,
			handleRenderingErrors: true
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: mdsvex(),
	compilerOptions: { experimental: { async: true } }
};

export default config;
