export type OAuthConfig = {
	discord?: {
		clientId: string;
		clientSecret: string;
	};
};

export type Config = {
	oauth?: OAuthConfig;
	steam_api_key?: string;
};
