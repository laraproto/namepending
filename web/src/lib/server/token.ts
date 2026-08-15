import { CryptoHasher } from 'bun';
import db, { schema } from '$lib/server/db';

const hasher = new CryptoHasher('sha256');

function sha256(data: Uint8Array): Uint8Array {
  hasher.update(data);
  return hasher.digest();
}

export function generateSessionToken() {
	const bytes = crypto.getRandomValues(new Uint8Array(18));
	const token = bytes.toBase64();
	return token;
}

export function createAccountLinkCode() {
	const bytes = crypto.getRandomValues(new Uint8Array(8));
	const code = bytes.toBase64();
	return code;
}

export async function createServerApiKey(token: string, userId: string, description: string) {
	const sessionKey = sha256(new TextEncoder().encode(token)).toHex();
	const apiKey: schema.ServerInsert = {
		key: sessionKey,
		creatorId: userId,
		description
	};

	await db.insert(schema.servers).values(apiKey);

	return apiKey;
}

export async function validateServerApiKey(token: string) {
	const apikey = sha256(new TextEncoder().encode(token)).toHex();
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

export async function createLookupKey(token: string, userId: string) {
	const sessionKey = sha256(new TextEncoder().encode(token)).toHex();

	const player = await db.query.player.findFirst({
		where: (players, { eq }) => eq(players.platformId, userId)
	});

	if (!player) {
		throw new Error('Player not found');
	}

	const lookupKey = {
		code: sessionKey,
		playerId: player.uuid,
		expiresAt: new Date(Date.now() + 15 * 60 * 1000) // Expires in 15 minutes
	} satisfies schema.LookupInsert;

	await db.insert(schema.lookupKeys).values(lookupKey);

	return lookupKey;
}

export async function validateLookupKey(token: string) {
	const lookupKey = sha256(new TextEncoder().encode(token)).toHex();

	const result = await db.query.lookupKeys.findFirst({
		where: (lookupKeys, { eq }) => eq(lookupKeys.code, lookupKey),
		with: {
			player: true
		}
	});

	return result;
}

export async function createLinkEntry(code: string, playerId: string) {
	const sessionKey = sha256(new TextEncoder().encode(code)).toHex();
	const linkCode = {
		code: sessionKey,
		playerId,
		expiresAt: new Date(Date.now() + 1000 * 60 * 15) // 15 minutes
	} satisfies schema.AccountLinkInsert;

	await db.insert(schema.accountLinkCodes).values(linkCode);

	return linkCode;
}

export async function validateLinkEntry(code: string) {
	const apikey = sha256(new TextEncoder().encode(code)).toHex();
	const result = await db.query.accountLinkCodes.findFirst({
		where: (accountLinkCode, { eq }) => eq(accountLinkCode.code, apikey),
		with: {
			player: true
		}
	});

	return result ?? null;
}
