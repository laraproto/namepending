import adapter from '@sveltejs/adapter-node';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		alias: {
			'@modules': '../api/src/modules',
			'@routes': '../api/src/routes'
		}
	}
};

export default config;
