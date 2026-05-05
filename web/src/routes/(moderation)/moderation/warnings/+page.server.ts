import trpc from '$lib/server/trpc-server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ url }) => {
	const page = Number(url.searchParams.get('page') ?? '0');
	const query = url.searchParams.get('q') ?? '';

	const warns = await trpc.panel.moderation.warns.query({
		query,
		page: page + 1
	});

	if (page + 1 > warns.pageCount) {
		redirect(302, `${url.pathname}?q=${query}&page=${warns.pageCount - 1}`);
	}

	return {
		warns
	};
}) satisfies PageServerLoad;
