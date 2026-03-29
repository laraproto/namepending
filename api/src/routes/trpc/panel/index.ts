import { permsProcedure, router } from '@modules/trpc';
import { z } from 'zod';

export const panelRouter = router({
	hello: permsProcedure
		.meta({
			permissionsRequired: 'VIEW_USERS'
		})
		.input(
			z.object({
				name: z.string().nullish()
			})
		)
		.output(z.string())
		.query(({ input }) => {
			return `Hello ${input.name ?? 'world'}`;
		})
});
