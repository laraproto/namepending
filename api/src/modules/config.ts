const isUndefinedOrEmpty = <T, V extends T>(value: string | undefined, replace_value?: T): V => {
	if (value === undefined || value.trim() === '') {
		return replace_value as V;
	}
	return value as V;
};

export const NODE_ENV = isUndefinedOrEmpty(Bun.env.NODE_ENV, 'development');

export const APP_URL = isUndefinedOrEmpty(Bun.env.URL, 'http://localhost:5173');

export const APP_SECRET = (() => {
	if (!isUndefinedOrEmpty(Bun.env.APP_SECRET))
		throw new Error('APP_SECRET environment variable is required');

	return Bun.env.APP_SECRET as string;
})();

export const STEAM_API_KEY = (() => {
	if (!isUndefinedOrEmpty(Bun.env.STEAM_API_KEY))
		throw new Error('STEAM_API_KEY environment variable is required');

	return Bun.env.STEAM_API_KEY as string;
})();

export const DISCORD_CLIENT_ID = (() => {
	if (!isUndefinedOrEmpty(Bun.env.DISCORD_CLIENT_ID))
		throw new Error('DISCORD_CLIENT_ID environment variable is required');

	return Bun.env.DISCORD_CLIENT_ID as string;
})();

export const DISCORD_CLIENT_SECRET = (() => {
	if (!isUndefinedOrEmpty(Bun.env.DISCORD_CLIENT_SECRET))
		throw new Error('DISCORD_CLIENT_SECRET environment variable is required');

	return Bun.env.DISCORD_CLIENT_SECRET as string;
})();

export const HOST = isUndefinedOrEmpty(Bun.env.HOST, 'localhost');
