<script>
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import { formatDuration, secondsToHours } from 'date-fns';

	let { data } = $props();

	let selectedPlayer = $state('');

	let triggerView = $derived(
		data.players.find((player) => player.uuid === selectedPlayer) ?? 'Select player'
	);
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
		<div class="bg-muted/50 min-h-screen flex-1 rounded-xl lg:min-h-min">
			<div class="items-center flex">
				<Select.Root type="single" bind:value={selectedPlayer}>
					<Select.Trigger
						>{typeof triggerView === 'string' ? triggerView : triggerView.name}</Select.Trigger
					>
					<Select.Content>
						<Select.Group>
							<Select.Label>Linked Profiles</Select.Label>
							{#each data.players as player (player.uuid)}
								<Select.Item value={player.uuid}>{player.name}</Select.Item>
							{/each}
						</Select.Group>
					</Select.Content>
				</Select.Root>
			</div>
			<Separator class="my-4" />
		</div>
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
