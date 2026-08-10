import type { PageServerLoad } from './$types';
import auth from '$lib/server/auth';

export const load = (async ({ request }) => {
	return {
		connections: await auth.api.getOAuthConsents({
			headers: request.headers
		})
	};
}) satisfies PageServerLoad;
