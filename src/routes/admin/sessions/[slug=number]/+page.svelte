<script lang="ts">
	import { pb } from '$lib/pocketbase';
	import { t } from 'svelte-i18n';
	import toast from 'svelte-french-toast';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';
	import Filigrane from '$components/graph/Filigrane.svelte';
	import { mainTitle } from '$stores/titles';
	import type { NodeMessage } from '$types/graph';

	export let data;

	mainTitle.set(data.sessionData.name + ' - ' + $t('admin'));

	let selectedNode: NodeMessage | null = null;
	async function addNode(title: string, text: string, author: string, parentNodeId: string) {
		try {
			await pb.collection('Node').create({
				title,
				text,
				author,
				type: 'contribution',
				parent: parentNodeId,
				session: data.sessionData.id
			});
		} catch (error) {
			// TODO: Traduction
			toast.error('Une erreur est survenue', {
				position: 'bottom-center'
			});
			return;
		}

		// TODO: Traduction
		toast.success('Nœud ajouté avec succès', {
			position: 'bottom-center'
		});
	}

	async function endSession() {
		data.sessionData = await pb.collection('Session').update(data.sessionData.id, {
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
