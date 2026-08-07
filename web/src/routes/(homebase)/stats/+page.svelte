<script lang="ts">
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import trpc from '$lib/trpc';
	import { formatDuration, secondsToHours } from 'date-fns';

	let { data } = $props();

	let playerSelect = $derived(data.players[0]?.uuid);
</script>

<Head title="Player Stats" />

<div class="flex flex-1 flex-col gap-4 p-4">
	{#if data.stats}
		<div class="grid auto-rows-min gap-4 lg:grid-cols-3">
			<Card.Root class="bg-muted/50 aspect-video rounded-xl">
				<Card.Header class="text-center font-bold text-2xl">Playtime Total</Card.Header>
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
			<Card.Root class="bg-muted/50 aspect-video rounded-xl">
				<Card.Header class="text-center font-bold text-2xl">Playtime This Week</Card.Header>
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
			<Card.Root class="bg-muted/50 aspect-video rounded-xl">
				<Card.Header class="text-center font-bold text-2xl">Playtime Last Week</Card.Header>
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
					<Card.Root class="bg-muted/50 min-h-screen flex-1 rounded-xl lg:min-h-min">
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
										<Card.Root class="bg-muted/50 aspect-video rounded-xl">
											<Card.Header class="text-center font-bold text-2xl"
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
										<Card.Root class="bg-muted/50 aspect-video rounded-xl">
											<Card.Header class="text-center font-bold text-2xl"
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
										<Card.Root class="bg-muted/50 aspect-video rounded-xl">
											<Card.Header class="text-center font-bold text-2xl"
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
		No linked account found
	{/if}
</div>

<p>
	Logged in as {data.user.name} (id: {data.user.id})
	<br />
	Group: {data.user.group ? data.user.group.name : 'None'}
	<br />
	User flags: {data.user.flags} (bitwise)
	<br />
	Group flags: {data.user.group ? data.user.group.permissions : 'N/A'} (bitwise)
</p>
