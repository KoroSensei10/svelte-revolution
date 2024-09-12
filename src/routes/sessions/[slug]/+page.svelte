<script>
	import ForceGraph from '../../../components/ForceGraph.svelte';

	export let data;
</script>

{#if !data}
	<p class="text-center mt-5">Aucun nœud pour cette session</p>
{:else}
	<div class="flex flex-col justify-center">
		<h1 class="text-center mt-5">
			Session :
			<span class="first-letter:capitalize">
				{data.name}
			</span>
			<span class="font-bold">
				#{data.id}
			</span>
		</h1>
		<ForceGraph nodes={data.nodes} links={data.links} sessionId={data.id} />
	</div>
{/if}
