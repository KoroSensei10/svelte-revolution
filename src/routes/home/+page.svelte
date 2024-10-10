<script>
	import ExampleGraph from '$components/graph/ExampleGraph.svelte';
	import homeStore from '$stores/home/index.svelte';
</script>

<div class="flex flex-col items-center h-full gap-12 px-4">
	<h1 class="pb-0">Babel Révolution</h1>
	<div class="flex flex-col items-center gap-12 md:flex-row">
		<div class="flex justify-center w-full">
			<ExampleGraph />
		</div>
		<div class="flex flex-col items-center text-white">
			<div class="text-xl font-semibold first-letter:capitalize">{homeStore.selectedNode?.title}</div>
			<div class="text-center">{homeStore.selectedNode?.text}</div>
		</div>
	</div>
</div>
