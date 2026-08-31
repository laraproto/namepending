<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import TriangleAlert from '@lucide/svelte/icons/triangle-alert';
	import trpc from '$lib/trpc';
	import { formatDuration, secondsToHours } from 'date-fns';
	import { resolve } from '$app/paths';

	let { data } = $props();

	let playerSelect = $derived(data.players[0]?.uuid);
</script>

<Head title="Player Stats" />

<div class="flex flex-1 flex-col gap-4 p-4">
	{#if data.stats}
		<div class="grid auto-rows-min gap-4 lg:grid-cols-3">
			<Card.Root class="aspect-video rounded-xl bg-muted/50">
				<Card.Header class="text-center text-2xl font-bold">Playtime Total</Card.Header>
				<Card.Content class="flex flex-1 items-center justify-center text-5xl font-bold"
					>{formatDuration(
						{ hours: secondsToHours(data.stats.timeTotal) },
						{
							zero: true,
							format: ['hours']
						}
					)}</Card.Content
				>
			</Card.Root>
			<Card.Root class="aspect-video rounded-xl bg-muted/50">
				<Card.Header class="text-center text-2xl font-bold">Playtime This Week</Card.Header>
				<Card.Content class="flex flex-1 items-center justify-center text-5xl font-bold"
					>{formatDuration(
						{ hours: secondsToHours(data.stats.timeThisWeek) },
						{
							zero: true,
							format: ['hours']
						}
					)}</Card.Content
				>
			</Card.Root>
			<Card.Root class="aspect-video rounded-xl bg-muted/50">
				<Card.Header class="text-center text-2xl font-bold">Playtime Last Week</Card.Header>
				<Card.Content class="flex flex-1 items-center justify-center text-5xl font-bold"
					>{formatDuration(
						{ hours: secondsToHours(data.stats.timeLastWeek) },
						{
							zero: true,
							format: ['hours']
						}
					)}</Card.Content
				>
			</Card.Root>
		</div>
		<Tabs.Root bind:value={playerSelect} class="min-h-screen flex-1 rounded-xl lg:min-h-min">
			<Tabs.List>
				{#each data.players as player (player.uuid)}
					<Tabs.Trigger value={player.uuid}>{player.name}</Tabs.Trigger>
				{/each}
			</Tabs.List>
			{#each data.players as player (player.uuid)}
				<Tabs.Content value={player.uuid}>
					<Card.Root class="min-h-screen flex-1 rounded-xl bg-muted/50 lg:min-h-min">
						{const playerStatPromise = trpc.panel.user.getStatsForPlayer.query({
							playerId: playerSelect
						})}
						<Card.Header>
							<Card.Title>Stats for {player.name}</Card.Title>
						</Card.Header>
						<Card.Content>
							{#await playerStatPromise}
								<p>Loading stats...</p>
							{:then playerStat}
								{#if playerStat && playerStat.stats}
									<div class="grid auto-rows-min gap-4 lg:grid-cols-3">
										<Card.Root class="aspect-video rounded-xl bg-muted/50">
											<Card.Header class="text-center text-2xl font-bold"
												>Playtime Total</Card.Header
											>
											<Card.Content
												class="flex flex-1 items-center justify-center text-5xl font-bold"
												>{formatDuration(
													{ hours: secondsToHours(playerStat.stats.timeTotal) },
													{
														zero: true,
														format: ['hours']
													}
												)}</Card.Content
											>
										</Card.Root>
										<Card.Root class="aspect-video rounded-xl bg-muted/50">
											<Card.Header class="text-center text-2xl font-bold"
												>Playtime This Week</Card.Header
											>
											<Card.Content
												class="flex flex-1 items-center justify-center text-5xl font-bold"
												>{formatDuration(
													{ hours: secondsToHours(playerStat.stats.timeThisWeek) },
													{
														zero: true,
														format: ['hours']
													}
												)}</Card.Content
											>
										</Card.Root>
										<Card.Root class="aspect-video rounded-xl bg-muted/50">
											<Card.Header class="text-center text-2xl font-bold"
												>Playtime Last Week</Card.Header
											>
											<Card.Content
												class="flex flex-1 items-center justify-center text-5xl font-bold"
												>{formatDuration(
													{ hours: secondsToHours(playerStat.stats.timeLastWeek) },
													{
														zero: true,
														format: ['hours']
													}
												)}</Card.Content
											>
										</Card.Root>
									</div>
								{:else}
									No stats found for this player
								{/if}
							{/await}
						</Card.Content>
					</Card.Root>
				</Tabs.Content>
			{/each}
		</Tabs.Root>
	{:else}
		<div class="mx-auto my-8 flex flex-1 flex-col items-center justify-center px-4">
			<TriangleAlert size={128} class="mr-2 w-sm text-primary" />
			<span class="text-lg"
				>No linked accounts found, please <a
					href={resolve('/settings')}
					class="text-primary hover:underline">link your account here</a
				> to view stats</span
			>
		</div>
	{/if}
</div>

{#if false}
	<p>
		Logged in as {data.user.name} (id: {data.user.id})
		<br />
		Group: {data.user.group ? data.user.group.name : 'None'}
		<br />
		User flags: {data.user.flags} (bitwise)
		<br />
		Group flags: {data.user.group ? data.user.group.permissions : 'N/A'} (bitwise)
	</p>
{/if}
