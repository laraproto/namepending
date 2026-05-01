<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import Head from '$lib/components/Head.svelte';
	import type { PageProps } from './$types';
	import PlayerTable from '$lib/components/tables/player-table.svelte';
	import { columns } from '$lib/components/tables/player-table';

	let { data }: PageProps = $props();
</script>

<Head title={data.user ? `${data.user.name}'s Profile` : 'User Not Found'} />

{#if data.user}
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
					<Card.Content>Overview of website profile</Card.Content>
				</Card.Root>
			</div>
		</div>
		<Card.Root>
			<Card.Header>
				<Card.Title>Player Profiles</Card.Title>
			</Card.Header>
			<Card.Content>
				<PlayerTable data={data.user.players || []} {columns} />
			</Card.Content>
		</Card.Root>
	</div>
{:else}
	<div class="container mx-auto my-8 flex flex-col items-center gap-4 px-4">
		<h1 class="text-2xl font-semibold">User not found</h1>
		<p class="text-muted-foreground">The user you are looking for does not exist.</p>
	</div>
{/if}
