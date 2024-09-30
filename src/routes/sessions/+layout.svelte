<script lang="ts">
	import { mainTitleStore } from '$stores/titles';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		mainTitleStore.set('Babel Révolution');
	});
</script>

<slot></slot>
