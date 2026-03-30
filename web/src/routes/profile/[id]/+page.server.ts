import type { PageServerLoad } from './$types';
import trpc from '$lib/server/trpc-server';

export const load = (async ({ params }) => {
	return { user: await trpc.panel.getProfile.query(params.id) };
}) satisfies PageServerLoad;
