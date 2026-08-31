<script lang="ts">
	import type { LayoutProps } from './$types';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as NavigationMenu from '$lib/components/ui/navigation-menu/index.js';
	import { navigationMenuTriggerStyle } from '$lib/components/ui/navigation-menu/navigation-menu-trigger.svelte';
	import { onDestroy } from 'svelte';
	import { resolve } from '$app/paths';

	const sidebar = Sidebar.useSidebar();

	let { children }: LayoutProps = $props();

	$effect(() => {
		sidebar.setToolbar(profileToolbar, null);
	});

	onDestroy(() => {
		sidebar.setToolbar(null, null);
	});
</script>

{#snippet profileToolbar()}
	<div class="flex w-full items-center gap-2">
		<NavigationMenu.Root>
			<NavigationMenu.List>
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/settings')} class={navigationMenuTriggerStyle()}>General</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
				{#if false}
					<NavigationMenu.Item>
						<NavigationMenu.Link>
							{#snippet child()}
								<a href={resolve('/settings/connections')} class={navigationMenuTriggerStyle()}
									>Connections</a
								>
							{/snippet}
						</NavigationMenu.Link>
					</NavigationMenu.Item>
				{/if}
				<NavigationMenu.Item>
					<NavigationMenu.Link>
						{#snippet child()}
							<a href={resolve('/settings/themes')} class={navigationMenuTriggerStyle()}>Themes</a>
						{/snippet}
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			</NavigationMenu.List>
		</NavigationMenu.Root>
	</div>
{/snippet}

{@render children?.()}
