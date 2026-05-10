import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { resolve } from '$app/paths';

export const load = (async ({ parent, params }) => {
	const { user } = await parent();

	if (!user) {
		redirect(
			302,
			resolve('/profile/[id]', {
				id: params.id
			})
		);
	}
	return {
		user
	};
}) satisfies PageServerLoad;
