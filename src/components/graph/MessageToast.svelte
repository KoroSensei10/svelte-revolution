<script lang="ts">
	import toast_, { type Toast } from 'svelte-french-toast';
	import { selectedNodeStore } from '$stores/graph';
	import type { GraphNode } from '$types/pocketBase/TableTypes';

	type MyToast = Toast & { props: { record: GraphNode; author: string } };

	interface Props {
		toast: MyToast;
	}

	let { toast }: Props = $props();
</script>

<span class="flex flex-col items-center">
	<!-- TODO: translate -->
	<button onclick={() => selectedNodeStore.set(toast.props.record)}>New message by: {toast.props.author}</button>
	<button onclick={() => toast_.dismiss(toast.id)}>Dismiss</button>
</span>
