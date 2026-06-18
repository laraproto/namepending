import type { PageServerLoad } from './$types';

import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.localUser) {
		redirect(302, '/auth/login');
	}

	const stats = await trpc.panel.user.getStats.query();

	return {
		stats,
		user: locals.localUser
	};
}) satisfies PageServerLoad;
