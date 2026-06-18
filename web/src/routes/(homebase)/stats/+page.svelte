<script>
	import Head from '$lib/components/Head.svelte';
	import * as Card from '$lib/components/ui/card';
	import { formatDuration, secondsToHours } from 'date-fns';

	let { data } = $props();
</script>

<Head title="Player Stats" />

<div class="flex flex-1 flex-col gap-4 p-4">
	<div class="grid auto-rows-min gap-4 md:grid-cols-3">
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
	<div class="bg-muted/50 min-h-screen flex-1 rounded-xl md:min-h-min"></div>
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
