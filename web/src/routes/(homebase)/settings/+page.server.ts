import type { PageServerLoad } from './$types';

import trpc from '$lib/server/trpc/client';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	if (!locals.session || !locals.user) {
		redirect(302, '/auth/login');
	}
}) satisfies PageServerLoad;
