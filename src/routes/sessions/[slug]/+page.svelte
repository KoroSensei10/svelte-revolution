<script>
	import ForceGraph from '../../../components/graph/ForceGraph.svelte';

	export let data;
</script>

<!-- {#if !data}
	<p class="mt-5 text-center">Aucun nœud pour cette session</p>
{:else}
	<div class="flex flex-col justify-center h-full">
		<h1 class="mt-5 text-center">
			Session :
			<span class="first-letter:capitalize">
				{data.name}
			</span>
			<span class="font-bold">
				#{data.id}
			</span>
		</h1>
	</div>
{/if} -->

<ForceGraph nodes={data.nodes} links={data.links} sessionId={data.id} />
