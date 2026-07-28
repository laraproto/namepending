import adapter from '@sveltejs/adapter-node';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@modules': '../api/src/modules',
			'@routes': '../api/src/routes'
		}
	},
	extensions: ['.svelte', '.svx', '.md'],
	preprocess: mdsvex()
};

export default config;
