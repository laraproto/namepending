import * as c from 'commander';
import pc from 'picocolors';
import z from 'zod';
import * as p from '@clack/prompts';

import * as fs from 'node:fs/promises';

const envSchema = z.object({
	url: z.url({
		protocol: /^https?$/,
		hostname: z.regexes.domain
	}),
	postgres_pass: z
		.string()
		.min(8)
		.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
	minio_user: z.string().default('minioadmin'),
	minio_pass: z
		.string()
		.min(8)
		.default(crypto.getRandomValues(new Uint8Array(32)).toHex()),
	traefik_dashboard: z.boolean().default(false),
	traefik_dashboard_port: z.int().min(1024).max(65535).default(8781),
	traefik_web_port: z.int().min(1024).max(65535).default(8778),
	app_secret: z
		.string()
		.min(32)
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

	const url = await p.text({
		message: 'What is the URL of the project',
		validate(value) {
			const errorValidate = envSchema.shape.url.safeParse(value);
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(url)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const postgres_pass = await p.password({
		message: 'Password for Postgres (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate(value) {
			const errorValidate = envSchema.shape.postgres_pass.safeParse(value);
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(postgres_pass)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const minio_user = await p.text({
		message: 'Username for Minio (default: minioadmin)',
		initialValue: 'minioadmin',
		validate(value) {
			const errorValidate = envSchema.shape.minio_user.safeParse(value);
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(minio_user)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const minio_pass = await p.password({
		message: 'Password for Minio (will be generated if empty)',
		mask: '*',
		clearOnError: true,
		validate(value) {
			const errorValidate = envSchema.shape.minio_pass.safeParse(value);
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(minio_pass)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const traefik_dashboard = await p.confirm({
		message: 'Do you want to enable the Traefik dashboard?',
		initialValue: false
	});

	if (p.isCancel(traefik_dashboard)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const traefik_dashboard_port = await p.text({
		message: 'Port for Traefik dashboard (default: 8781)',
		initialValue: '8781',
		validate(value) {
			const errorValidate = envSchema.shape.traefik_dashboard_port.safeParse(Number(value));
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(traefik_dashboard_port)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const traefik_web_port = await p.text({
		message: 'Port for Traefik web entrypoint (default: 8778)',
		initialValue: '8778',
		validate(value) {
			const errorValidate = envSchema.shape.traefik_web_port.safeParse(Number(value));
			return errorValidate.success ? undefined : z.prettifyError(errorValidate.error);
		}
	});

	if (p.isCancel(traefik_web_port)) {
		p.cancel('Setup cancelled');
		process.exit(0);
	}

	const envValue = envSchema.parse({
		url,
		postgres_pass,
		minio_user,
		minio_pass,
		traefik_dashboard,
		traefik_dashboard_port: Number(traefik_dashboard_port),
		traefik_web_port: Number(traefik_web_port)
	});

	fs.writeFile(
		'.env',
		Object.entries(envValue)
			.map(([key, value]) => `${key.toUpperCase()}=${value}`)
			.join('\n')
	);

	p.outro(pc.green('Setup completed! .env file has been created with the provided values.'));
}
