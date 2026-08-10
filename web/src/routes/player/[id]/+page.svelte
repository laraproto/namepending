<script lang="ts">
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import Head from '$lib/components/Head.svelte';
	import type { PageProps } from './$types';
	import { formatDuration, secondsToHours } from 'date-fns';

	let { data }: PageProps = $props();
</script>

<Head title={data.player ? `Player ${data.player.name}` : 'Player Not Found'} />

{#if data.player}
	<div class="container mx-auto my-8 flex flex-col gap-4 px-4">
		<div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
			<div class="lg:col-span-1">
				<Card.Root>
					<Card.Content>
						<div class="flex flex-col items-center space-y-4">
							<Avatar.Root class="h-32 w-32">
								<Avatar.Fallback class="text-4xl">{data.player.name}</Avatar.Fallback>
							</Avatar.Root>
							<div class="text-center">
								<h2 class="text-xl font-semibold">{data.player.name}</h2>
								<p class="text-sm text-muted-foreground">{data.player.platformId}</p>
							</div>
						</div></Card.Content
					>
				</Card.Root>
			</div>
			<div class="flex flex-col lg:col-span-2">
				<Card.Root class="flex h-full flex-1 justify-center">
					<Card.Content>
						{#if data.player.stats}
							<div class="grid auto-rows-min grid-cols-3 gap-4">
								<Card.Root class=" rounded-xl bg-muted/50">
									<Card.Header class="text-center text-xl font-bold">Playtime Total</Card.Header>
									<Card.Content class="flex flex-1 items-center justify-center text-2xl font-bold"
										>{formatDuration(
											{ hours: secondsToHours(data.player.stats.timeTotal) },
											{
												zero: true,
												format: ['hours']
											}
										)}</Card.Content
									>
								</Card.Root>
								<Card.Root class="rounded-xl bg-muted/50">
									<Card.Header class="text-center text-xl font-bold">Playtime This Week</Card.Header
									>
									<Card.Content class="flex flex-1 items-center justify-center text-2xl font-bold"
										>{formatDuration(
											{ hours: secondsToHours(data.player.stats.timeThisWeek) },
											{
												zero: true,
												format: ['hours']
											}
										)}</Card.Content
									>
								</Card.Root>
								<Card.Root class="rounded-xl bg-muted/50">
									<Card.Header class="text-center text-xl font-bold">Playtime Last Week</Card.Header
									>
									<Card.Content class="flex flex-1 items-center justify-center text-2xl font-bold"
										>{formatDuration(
											{ hours: secondsToHours(data.player.stats.timeLastWeek) },
											{
												zero: true,
												format: ['hours']
											}
										)}</Card.Content
									>
								</Card.Root>
							</div>
						{:else}
							Stats not found for this player
						{/if}</Card.Content
					>
				</Card.Root>
			</div>
		</div>
		<Card.Root>
			<Card.Header>
				<Card.Title>History</Card.Title>
			</Card.Header>
			<Card.Content>Timeline will not be implemented in this release</Card.Content>
		</Card.Root>
	</div>
{:else}
	<div class="container mx-auto my-8 flex flex-col items-center gap-4 px-4">
		<h1 class="text-2xl font-semibold">Player not found</h1>
		<p class="text-muted-foreground">The player you are looking for does not exist.</p>
	</div>
{/if}
