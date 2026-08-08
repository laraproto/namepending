import type { PageServerLoad } from './$types';
import auth from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ request, url }) => {

	const client_id = url.searchParams.get('client_id') ?? undefined;

	if (!client_id) { 
		redirect(302, '/auth/fail?error=client_id_not_found&error_description=Missing+client_id+parameter');
	}

	const client = await auth.api.getOAuthClient({
		query: {
			client_id,
		},
		headers: request.headers
	})

	return {
		client
	};
}) satisfies PageServerLoad;
