import type { LayoutServerLoad } from './$types';
import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';
import { isTRPCClientError } from '@trpc/client';

export const load = (async ({ params, locals }) => {
	if (!locals.session) {
		redirect(302, '/auth/login');
	}
	try {
		return { player: await trpc.panel.getPlayer.query(params.id) };
	} catch (err) {
		if (isTRPCClientError(err)) {
			if (err.name === 'FORBIDDEN') {
				return { player: null };
			}
		}
		throw err;
	}
}) satisfies LayoutServerLoad;
