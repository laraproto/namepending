import db, { schema } from '@modules/db';
import { permsProcedure, router } from '@modules/trpc';
import { desc } from 'drizzle-orm';

export const administrationRouter = router({
	getPanelRoles: permsProcedure.meta({ permissionsRequired: ['VIEW_ROLES'] }).query(async () => {
		try {
			const roles = await db.query.panelGroups.findMany({
				orderBy: [desc(schema.panelGroups.createdAt)]
			});

			return {
				data: roles,
				count: roles.length,
				pageCount: 1
			};
		} catch (err) {
			console.error(err);
			return {
				data: [],
				count: 0,
				pageCount: 1
			};
		}
	})
});
