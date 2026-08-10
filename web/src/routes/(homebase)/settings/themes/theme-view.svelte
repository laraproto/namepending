<script lang="ts">
	import { mode, setTheme as setThemeState } from 'mode-watcher';
	import { themeInfo, Theme } from './themes';
	import authClient from '$lib/auth';
	import { invalidateAll } from '$app/navigation';
	import type { UserSelect } from '$lib/server/db/schema';

	let { user }: { user: UserSelect | null } = $props();

	const setTheme = async (theme: Theme) => {
		setThemeState(theme);
		await authClient.updateUser({ theme });
		await invalidateAll();
	};
</script>

{#snippet themeSnippet(theme: Theme)}
	{@const info = themeInfo[theme]}
	<button
		class="block rounded-xl border border-border bg-muted p-4 text-left transition-colors outline-none data-active:border-primary data-active:bg-primary/10"
		data-active={theme === user?.theme}
		onclick={() => setTheme(theme)}
	>
		<div class="flex flex-col items-start justify-between gap-3">
			<p class="text-sm font-semibold">{info.name}</p>
			<p class="text-xs text-muted-foreground">{info.description}</p>
		</div>
		<div
			class={[
				'mt-3 rounded-lg border bg-background p-2',
				info.class ? info.class?.[mode.current || 'light'] : theme
			]}
			data-theme={theme}
		>
			<div
				class="flex items-center justify-between rounded-md bg-muted/25 px-2 py-1 text-foreground"
			>
				<span class="text-[11px] font-semibold">lp0 on fire</span>
			</div>
		</div>
	</button>
{/snippet}

<div class="flex flex-1 flex-col gap-4">
	<div class="grid grid-cols-2 gap-4 md:grid-cols-3">
		{#each Object.values(Theme) as theme (theme)}
			{@render themeSnippet(theme)}
		{/each}
	</div>
</div>
