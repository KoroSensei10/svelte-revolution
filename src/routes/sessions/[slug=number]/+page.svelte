<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';

	import graphe1 from '$lib/assets/graphe1.png';

	import { mainTitle as mainTitleStore } from '$stores/titles';
	import { linksStore, nodesStore } from '$stores/graph/index.js';
	import { page } from '$app/stores';
	import Filigrane from '$components/graph/Filigrane.svelte';
	import type { PageServerData } from './$types.js';
	import type { LayoutServerData } from '../../$types.js';

	let admin = $derived.by(() => {
		const url = new URL($page.url);
		return url.searchParams.get('admin') === 'true';
	});

	interface Props {
		data: PageServerData & LayoutServerData;
	}
	let { data }: Props = $props();

	let title = $derived.by(() => {
		return (admin ? 'ADMIN - ' : '') + data.sessionData.name;
	});

	mainTitleStore.set(data.sessionData.name);
	nodesStore.set(data.nodesAndLinks.nodes);
	linksStore.set(data.nodesAndLinks.links);

	onMount(async () => {
		await pb.collection('Session').subscribe(data.sessionData.id, (res) => {
			data.sessionData = res.record;
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
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

<GraphUi {admin} session={data.sessionData} />
{#if admin && data.user}
	<Filigrane watermarkText="Admin">
		<ForceGraph sessionId={data.sessionData.id} />
	</Filigrane>
{:else}
	<ForceGraph sessionId={data.sessionData.id} />
{/if}
