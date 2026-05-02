import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '0');
	const query = url.searchParams.get('q') ?? '';

	const bans = await trpc.panel.moderation.bans.query({
		query,
		page: 2,
		limit: 10
	});

	if (page + 1 > bans.pageCount) {
		redirect(302, `${url.pathname}?q=${query}&page=${bans.pageCount - 1}`);
	}

	return {
		bans
	};
}) satisfies PageServerLoad;
