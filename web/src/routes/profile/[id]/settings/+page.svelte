<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import Head from '$lib/components/Head.svelte';
	import type { PageProps } from './$types';
	import * as Select from '$lib/components/ui/select/index.js';

	let { data }: PageProps = $props();

	const roles = $derived(
		data.roles?.data.map((role) => ({
			value: role.uuid,
			label: role.name
		})) ?? []
	);

	let roleValue = $state('');

	const triggerContent = $derived(
		roles.find((f) => f.value === roleValue)?.label ?? 'Select a role'
	);
</script>

<Head title={`${data.user.name}'s Profile`} />

<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
	<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
		<div class="lg:col-span-1">
			<Card.Root>
				<Card.Content>
					<div class="flex flex-col items-center space-y-4">
						<Avatar.Root class="h-32 w-32">
							<Avatar.Image src={data.user.image} alt={data.user.name} />
							<Avatar.Fallback class="text-4xl">{data.user.name}</Avatar.Fallback>
						</Avatar.Root>
						<div class="text-center">
							<h2 class="text-xl font-semibold">{data.user.name}</h2>
							<p class="text-sm text-muted-foreground">{data.user.id}</p>
						</div>
					</div></Card.Content
				>
			</Card.Root>
		</div>
		<div class="lg:col-span-2">
			<Card.Root class="h-full">
				<Card.Content>
					<p>
						Current Role: {data.user.group?.name ?? 'None'}<br />
						<span class="text-sm text-muted-foreground"
							>Role ID: {data.user.group?.uuid ?? 'N/A'}</span
						>
						<br />
						Joined: {new Date(data.user.createdAt).toLocaleDateString()}
						<br />
						Updated: {new Date(data.user.updatedAt).toLocaleDateString()}
					</p>
				</Card.Content>
			</Card.Root>
		</div>
		<div class="lg:col-span-1">
			<Card.Root>
				<Card.Header>
					<Card.Title>Role Management</Card.Title>
				</Card.Header>
				<Card.Content class="flex flex-col items-center">
					<Select.Root type="single" bind:value={roleValue}>
						<Select.Trigger class="w-60">
							{triggerContent}
						</Select.Trigger>
						<Select.Content>
							<Select.Group>
								<Select.Label>Roles</Select.Label>
								{#each roles as role (role.value)}
									<Select.Item
										value={role.value}
										label={role.label}
										disabled={role.value === data.user.group?.uuid}
									>
										{role.label}
									</Select.Item>
								{/each}
								<Select.Separator />
								<Select.Item value="" label="None" disabled={!data.user.group}>None</Select.Item>
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
