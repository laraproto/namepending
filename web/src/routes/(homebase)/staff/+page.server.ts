import trpc from '$lib/server/trpc-server';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	return {
		staff: await trpc.listStaff.query(url.searchParams.get('q') ?? '')
	};
}) satisfies PageServerLoad;
