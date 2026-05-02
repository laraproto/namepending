import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '0');
	const query = url.searchParams.get('q') ?? '';

	const staff = await trpc.listStaff.query({
		query,
		page: page + 1
	});

	if (page + 1 > staff.pageCount) {
		redirect(302, `${url.pathname}?q=${query}&page=${staff.pageCount - 1}`);
	}

	return {
		staff
	};
}) satisfies PageServerLoad;
