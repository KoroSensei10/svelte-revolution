<script>
	import ForceGraph from '../../../components/ForceGraph.svelte';

	export let data;
</script>

<div class="container">
	<ForceGraph nodes={data.nodes} links={data.links} />
</div>
