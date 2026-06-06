import type { PageServerLoad } from './$types';

import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.session) {
		redirect(302, '/auth/login');
	}

	const stats = await trpc.panel.user.getStats.query();

	return {
		stats
	};
}) satisfies PageServerLoad;
