<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { SiDiscord } from '@icons-pack/svelte-simple-icons';
	import {
		FieldGroup,
		Field,
		FieldLabel,
		FieldDescription
	} from '$lib/components/ui/field/index.js';
	import { resolve } from '$app/paths';

	const id = $props.id();
</script>

<Card.Root class="mx-auto w-full max-w-sm">
	<Card.Header>
		<Card.Title class="text-2xl">Login</Card.Title>
		<Card.Description>Enter your email below to login to your account</Card.Description>
	</Card.Header>
	<Card.Content>
		<form>
			<FieldGroup>
				<Field>
					<FieldLabel for="email-{id}">Email</FieldLabel>
					<Input id="email-{id}" type="email" placeholder="m@example.com" required />
				</Field>
				<Field>
					<div class="flex items-center">
						<FieldLabel for="password-{id}">Password</FieldLabel>
						<a
							href={resolve('/auth/forgot-password')}
							class="ms-auto inline-block text-sm underline"
						>
							Forgot your password?
						</a>
					</div>
					<Input id="password-{id}" type="password" required />
				</Field>
				<Field>
					<Button type="submit" class="w-full">Login</Button>
					<Button variant="outline" class="w-full">
						<SiDiscord />
						Login with Discord
					</Button>
					<FieldDescription class="text-center">
						Don't have an account? <a href={resolve('/auth/register')}>Sign up</a>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	</Card.Content>
</Card.Root>
