import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
export const load = (async ({ locals }) => {
	if (!locals.session) {
		redirect(302, '/auth/login');
	}
}) satisfies LayoutServerLoad;
