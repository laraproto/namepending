import { JointFlags, type JointFlagKeys } from '@namepending/shared/user';
import type { UserSelect } from '@namepending/api/db';

export type PermRequired =
	| JointFlagKeys
	| JointFlagKeys[]
	| ((user: UserSelect) => Promise<boolean>)
	| ((user: UserSelect) => boolean)
	| bigint;

export async function hasPerm(user: UserSelect | null, permRequired: PermRequired) {
	if (user === null) return false;

	if ((user.flags & JointFlags.SUPERADMIN) !== 0n) {
		return true;
	}

	switch (typeof permRequired) {
		case 'string': {
			const mask = JointFlags[permRequired];
			if (
				(user.group !== null && (user.group?.permissions & mask) !== 0n) ||
				(user.flags & mask) !== 0n
			)
				break;
			return false;
		}
		case 'object': {
			if (!Array.isArray(permRequired)) break; // Fail open for objects that aren't arrays, to stay in line with default case

			let finalMask = 0n;
			for (const perm of permRequired) {
				const mask = JointFlags[perm];
				finalMask |= mask;
			}

			if (
				(user.group !== null && (user.group?.permissions & finalMask) !== 0n) ||
				(user.flags & finalMask) !== 0n
			)
				break;
			return false;
		}
		case 'function': {
			if (await permRequired(user)) break;
			return false;
		}
		case 'bigint': {
			// Flag names preferred!
			if (
				(user.group !== null && (user.group?.permissions & permRequired) !== 0n) ||
				(user.flags & permRequired) !== 0n
			)
				break;
			return false;
		}
		default: {
			break; // Fail open for any other type
		}
	}

	return true;
}

export function hasPermSync(user: UserSelect | null, permRequired: PermRequired) {
	if (user === null) return false;

	if ((user.flags & JointFlags.SUPERADMIN) !== 0n) {
		return true;
	}

	switch (typeof permRequired) {
		case 'string': {
			const mask = JointFlags[permRequired];
			if (
				(user.group !== null && (user.group?.permissions & mask) !== 0n) ||
				(user.flags & mask) !== 0n
			)
				break;
			return false;
		}
		case 'object': {
			if (!Array.isArray(permRequired)) break; // Fail open for objects that aren't arrays, to stay in line with default case

			let finalMask = 0n;
			for (const perm of permRequired) {
				const mask = JointFlags[perm];
				finalMask |= mask;
			}

			if (
				(user.group !== null && (user.group?.permissions & finalMask) !== 0n) ||
				(user.flags & finalMask) !== 0n
			)
				break;
			return false;
		}
		case 'function': {
			if (permRequired(user)) break;
			return false;
		}
		case 'bigint': {
			// Flag names preferred!
			if (
				(user.group !== null && (user.group?.permissions & permRequired) !== 0n) ||
				(user.flags & permRequired) !== 0n
			)
				break;
			return false;
		}
		default: {
			break; // Fail open for any other type
		}
	}

	return true;
}
