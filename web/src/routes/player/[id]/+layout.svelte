<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { onMount, onDestroy } from 'svelte';
	import { resolve } from '$app/paths';
	import { hasPermSync } from '$lib/perm-utils';

	const sidebar = Sidebar.useSidebar();

	let { data, children }: LayoutProps = $props();

	onMount(() => {
		if (data.player) {
			sidebar.setToolbar(profileToolbar, data.player);
		}
	});

	onDestroy(() => {
		sidebar.setToolbar(null, null);
	});
</script>

{#snippet profileToolbar(player: NonNullable<LayoutProps['data']['player']>)}
	<div class="flex w-full items-center gap-2">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a
								href={resolve('/player/[id]', {
									id: player.platformId
								})}
								class={navigationMenuTriggerStyle()}>Overview</a
							>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				{#if hasPermSync(sidebar.user, 'VIEW_WARNINGS')}
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							{#snippet child()}
								<a
									href={resolve('/player/[id]/warns', {
										id: player.platformId
									})}
									class={navigationMenuTriggerStyle()}>Warns</a
								>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
				{#if hasPermSync(sidebar.user, 'VIEW_BANS')}
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							{#snippet child()}
								<a
									href={resolve('/player/[id]/bans', {
										id: player.platformId
									})}
									class={navigationMenuTriggerStyle()}>Bans</a
								>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
{/snippet}

{@render children?.()}
