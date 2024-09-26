<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';

	import toast from 'svelte-french-toast';
	import { mainTitle } from '$stores/titles';
	import type { NodeMessage } from '$types/graph';
	import { t } from 'svelte-i18n';
	import Filigrane from '$components/graph/Filigrane.svelte';

	export let data;

	mainTitle.set(data.sessionData.name + ' - ' + $t('admin'));

	let selectedNode: NodeMessage | null = null;
	async function addNode(title: string, text: string, author: string, parentNodeId: string) {
		await pb.collection('Node').create({
			title,
			text,
			author,
			type: 'contribution',
			parent: parentNodeId,
			session: data.sessionData.id
		});

		toast.success('Nœud ajouté avec succès', {
			position: 'bottom-center'
		});
	}

	async function endSession() {
		await pb.collection('Session').update(data.sessionData.id, {
			completed: true
		});
	}
</script>

<GraphUi addnode={addNode} {selectedNode} user={data.user} session={data.sessionData} on:endSession={endSession} />
<Filigrane watermarkText={$t('admin')}>
	<ForceGraph
		bind:selectedNode
		nodes={data.nodesAndLinks.nodes}
		links={data.nodesAndLinks.links}
		sessionId={data.sessionData.id}
	/>
</Filigrane>
