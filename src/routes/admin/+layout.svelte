<script>
	import { mainTitle } from '$stores/titles';
	import { onDestroy } from 'svelte';

	mainTitle.set('Babel Révolution - Admin');

	onDestroy(() => {
		mainTitle.set('Babel Révolution');
	});
</script>

<svelte:head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss/dist/tailwind.min.css" />
</svelte:head>

<slot></slot>
