<script lang="ts">
	import { mainTitle } from '$stores/titles';
	import { onDestroy } from 'svelte';

	onDestroy(() => {
		mainTitle.set('Babel Révolution');
	});
</script>

<slot></slot>
