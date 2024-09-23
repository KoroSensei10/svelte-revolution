<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '../../../components/graph/ForceGraph.svelte';

	import toast from 'svelte-french-toast';
	import type { NodeType } from '../../../../types/tableTypes';
	import { mainTitle } from '$stores/titles';

	export let data;

	mainTitle.set(data.name);

	let selectedNode: NodeType | null = null;
	async function addNode(title: string, text: string, author: string, parentNodeId: string) {
		await pb.collection('Node').create({
			title,
			text,
			author,
			type: 'contribution',
			parent: parentNodeId,
			session: data.id
		});

		toast.success('Nœud ajouté avec succès', {
			position: 'bottom-center'
		});
	}
</script>

<GraphUi addnode={addNode} {selectedNode} />
<ForceGraph bind:selectedNode nodes={data.nodes} links={data.links} sessionId={data.id} />
