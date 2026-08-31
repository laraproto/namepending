import * as c from 'commander';
import pc from 'picocolors';
import z from 'zod';
import * as p from '@clack/prompts';

import * as fs from 'node:fs/promises';

const snowflake = z.stringFormat('snowflake', /[1-9][0-9]{5,19}/);

const envSchema = z.object({
	name: z.string().min(1).optional().default('namepending'),
	public_url: z.string().default('$URL'),
	public_name: z.string().default('$NAME'),
	url: z.url({
		protocol: /^https?$/,
		hostname: z.regexes.domain
	}),
	steam_api_key: z.string().min(1),
	discord_client_id: snowflake.min(1),
	discord_client_secret: z.string().min(1),
	smtp_host: z.string().min(1),
	smtp_port: z.number().int().min(1).max(65535),
	smtp_user: z.string().min(1),
	smtp_password: z.string().min(1),
	smtp_from: z.email(),
	postgres_pass: z
		.string()
		.min(8)
		.optional()
		.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
	garage_access_key: z
		.string()
		.min(8)
		.optional()
		.default(`GK${crypto.getRandomValues(new Uint8Array(32)).toHex()}`),
	garage_secret_key: z
		.string()
		.min(8)
		.optional()
		.default(`GS${crypto.getRandomValues(new Uint8Array(32)).toHex()}`),
	garage_pass: z
		.string()
		.min(8)
		.optional()
		.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
	web_port: z.int().min(1024).max(65535).optional().default(8778),
	app_secret: z
		.string()
		.min(32)
		.optional()
		.default(crypto.getRandomValues(new Uint8Array(32)).toHex())
});

const program = new c.Command();

program
	.name('namepending-setup')
	.description('hopefully an easier way to set up environment variables')
	.action(main);

program.parse();

async function main() {
	p.intro(pc.inverse('Namepending Setup'));

	const name = await p.text({
		message: 'What is the name of your panel (default: namepending)?',
		validate: envSchema.shape.name
	});

	if (p.isCancel(name)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const url = await p.text({
		message: 'What is the URL of the panel?',
		validate: envSchema.shape.url
	});

	if (p.isCancel(url)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const discord_client_id = await p.text({
		message:
			'Client Id for your discord application (obtained from making an app on https://discord.com/developers/applications)',
		validate: envSchema.shape.discord_client_id
	});

	if (p.isCancel(discord_client_id)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const discord_client_secret = await p.password({
		message: 'Client secret for your Discord application',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.discord_client_secret
	});

	if (p.isCancel(discord_client_secret)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const steam_api_key = await p.password({
		message: 'Steam API key (obtained from https://steamcommunity.com/dev/apikey)',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.steam_api_key
	});

	if (p.isCancel(steam_api_key)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const smtp_host = await p.text({
		message: 'SMTP host (for sending emails)',
		validate: envSchema.shape.smtp_host
	});

	if (p.isCancel(smtp_host)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const smtp_port = await p.text({
		message: 'SMTP port',
		validate(value) {
			const errorValidate = envSchema.shape.smtp_port.safeParse(Number(value));
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(smtp_port)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const smtp_user = await p.text({
		message: 'SMTP user',
		validate: envSchema.shape.smtp_user
	});

	if (p.isCancel(smtp_user)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const smtp_password = await p.password({
		message: 'SMTP password',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.smtp_password
	});

	if (p.isCancel(smtp_password)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const smtp_from = await p.text({
		message: 'SMTP from email',
		validate: envSchema.shape.smtp_from
	});

	if (p.isCancel(smtp_from)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const postgres_pass = await p.password({
		message: 'Password for Postgres (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.postgres_pass
	});

	if (p.isCancel(postgres_pass)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const garage_pass = await p.password({
		message: 'Admin password for Garage (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.garage_pass
	});

	if (p.isCancel(garage_pass)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const garage_access_key = await p.password({
		message: 'Access key for S3 on Garage (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.garage_access_key
	});

	if (p.isCancel(garage_access_key)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const garage_secret_key = await p.password({
		message: 'Secret key for S3 on Garage (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate: envSchema.shape.garage_secret_key
	});

	if (p.isCancel(garage_secret_key)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const web_port = await p.text({
		message: 'Port for web entrypoint (default: 8778)',
		initialValue: '8778',
		validate(value) {
			const errorValidate = envSchema.shape.web_port.safeParse(Number(value));
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(web_port)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const envValue = envSchema.parse({
		name: name.length > 0 ? name : undefined,
		url,
		discord_client_id,
		discord_client_secret,
		steam_api_key,
		smtp_host,
		smtp_port: Number(smtp_port),
		smtp_user,
		smtp_password,
		smtp_from,
		postgres_pass: postgres_pass.length > 0 ? postgres_pass : undefined,
		garage_pass: garage_pass.length > 0 ? garage_pass : undefined,
		garage_access_key: garage_access_key.length > 0 ? garage_access_key : undefined,
		garage_secret_key: garage_secret_key.length > 0 ? garage_secret_key : undefined,
		web_port: Number(web_port)
	});

	fs.writeFile(
		'.env',
		Object.entries(envValue)
			.map(([key, value]) => `${key.toUpperCase()}=${value}`)
			.join('\n')
	);

	p.outro(pc.green('Setup completed! .env file has been created with the provided values.'));
}
