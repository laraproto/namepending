const isUndefinedOrEmpty = (value: string | undefined, replace_value?: string) => {
	if (value === undefined || value.trim() === '') {
		return replace_value;
	}
	return value;
};

export const NODE_ENV = isUndefinedOrEmpty(Bun.env.NODE_ENV, 'development');

export const APP_URL = isUndefinedOrEmpty(Bun.env.URL, 'http://localhost:5173');

export const APP_SECRET = (() => {
	if (!isUndefinedOrEmpty(Bun.env.APP_SECRET))
		throw new Error('APP_SECRET environment variable is required');

	return Bun.env.APP_SECRET;
})();
