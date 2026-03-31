import trpc from '$lib/server/trpc-server';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	try {
		return {
			localUser: await trpc.getSelf.query()
		};
	} catch {
		return {
			localUser: null
		};
	}
};
