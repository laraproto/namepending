import { sha256 } from '@oslojs/crypto/sha2';
import { encodeBase64url, encodeHexLowerCase } from '@oslojs/encoding';
import db, { schema } from '@modules/db';

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = encodeBase64url(bytes);
	return token;
}

export async function createServerApiKey(token: string, userId: string, description: string) {
	const sessionKey = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const apiKey: schema.ServerInsert = {
		key: sessionKey,
		creatorId: userId,
		description
	};

	await db.insert(schema.servers).values(apiKey);

	return apiKey;
}

export async function validateServerApiKey(token: string) {
	const apikey = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const result = await db.query.servers.findFirst({
		where: (serversTable, { eq }) => eq(serversTable.key, apikey),
		with: {
			creator: {
				with: {
					group: true
				}
			}
		}
	});

	const validated = (await schema.serverSelect.safeParseAsync(result)).data ?? null;

	return validated;
}
