import type { LayoutServerLoad } from './$types';
import trpc from '$lib/server/trpc/client';
import { redirect } from '@sveltejs/kit';
import { isTRPCClientError } from '@trpc/client';

export const load = (async ({ params, locals }) => {
	if (!locals.session) {
		redirect(302, '/auth/login');
	}
	try {
		return { user: await trpc.panel.getProfile.query(params.id) };
	} catch (err) {
		if (isTRPCClientError(err)) {
			if (err.name === 'FORBIDDEN') {
				return { user: null };
			}
		}
		throw err;
	}
}) satisfies LayoutServerLoad;
