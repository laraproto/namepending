<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import Head from '$lib/components/Head.svelte';
	import type { PageProps } from './$types';
	import UpdateRoleForm from './update-role-form.svelte';

	let { data }: PageProps = $props();
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
			<UpdateRoleForm {data} />
		</div>
	</div>
</div>
