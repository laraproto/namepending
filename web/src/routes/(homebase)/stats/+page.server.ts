import type { PageServerLoad } from './$types';

import trpc from '$lib/server/trpc/client';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) {
		redirect(302, '/auth/login');
	}

	const stats = await trpc.panel.user.getStats.query();
	const players = await trpc.panel.user.getPlayers.query();

	return {
		stats,
		players,
		user: locals.user
	};
}) satisfies PageServerLoad;
