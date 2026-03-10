const isUndefinedOrEmpty = (value: string | undefined, replace_value?: string) => {
	if (value === undefined || value.trim() === '') {
		return replace_value;
	}
	return value;
};

export const NODE_ENV = isUndefinedOrEmpty(Bun.env.NODE_ENV, 'development');

export const URL = isUndefinedOrEmpty(Bun.env.URL, 'http://localhost:3000');

export const BETTER_AUTH_SECRET = (() => {
	if (!isUndefinedOrEmpty(Bun.env.BETTER_AUTH_SECRET))
		throw new Error('BETTER_AUTH_SECRET environment variable is required');

	return Bun.env.BETTER_AUTH_SECRET;
})();
