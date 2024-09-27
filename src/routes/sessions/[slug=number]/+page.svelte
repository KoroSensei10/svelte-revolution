<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import toast from 'svelte-french-toast';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';

	import graphe1 from '$lib/assets/graphe1.png';

	import { mainTitle as mainTitleStore } from '$stores/titles';
	import { linksStore, nodesStore } from '$stores/graph/index.js';
	import { page } from '$app/stores';

	export let data;

	mainTitleStore.set(data.sessionData.name);
	nodesStore.set(data.nodesAndLinks.nodes);
	linksStore.set(data.nodesAndLinks.links);

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

	onMount(async () => {
		await pb.collection('Session').subscribe(data.sessionData.id, (res) => {
			data.sessionData = res.record;
		});
	});
</script>

<svelte:head>
	<title>{data.sessionData.name}</title>
	<meta property="description" content={data.sessionData.expand?.scenario.prologue} />
	<meta
		property="og:image"
		content={data.sessionData.image ? pb.files.getUrl(data.sessionData, data.sessionData.image) : graphe1}
	/>
	<meta property="og:title" content={data.sessionData.name} />
	<meta property="og:description" content={data.sessionData.expand?.scenario.prologue} />
	<meta property="og:site_name" content="Babel Révolution" />
	<meta property="og:url" content={$page.url.href} />
</svelte:head>

<GraphUi addnode={addNode} session={data.sessionData} />
<ForceGraph sessionId={data.sessionData.id} />
