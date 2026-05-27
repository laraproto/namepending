<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let {
		open = $bindable(false),
		onConfirm,
		...restProps
	}: { open: boolean; onConfirm: () => void } = $props();

	const onSubmit = (event: SubmitEvent) => {
		event.preventDefault();
		onConfirm();
	};
</script>

<Dialog.Root bind:open {...restProps}>
	<Dialog.Content class="sm:max-w-106.25">
		<form onsubmit={onSubmit}>
			<Dialog.Header>
				<Dialog.Title>Delete Item</Dialog.Title>
				<Dialog.Description>
					Are you sure you want to delete this item? This action cannot be undone.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer>
				<Dialog.Close type="button" class={buttonVariants({ variant: 'outline' })}>
					Cancel
				</Dialog.Close>
				<Button type="submit">Confirm</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
