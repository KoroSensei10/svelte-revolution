<script>
	import ForceGraph from '../../../components/graph/ForceGraph.svelte';

	export let data;
</script>

<ForceGraph nodes={data.nodes} links={data.links} sessionId={data.id} />
