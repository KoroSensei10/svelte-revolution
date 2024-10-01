<svelte:options runes={true} />

<script lang="ts">
	import { onMount } from 'svelte';
	import { pb } from '$lib/pocketbase';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';
	import Watermark from '$components/admin/Watermark.svelte';

	import graph1 from '$lib/assets/graphe1.png';

	import { page } from '$app/stores';
	import { initStores } from './utils';
	import type { PageServerData } from './$types';
	import type { LayoutServerData } from '../../$types';

	interface Props {
		data: PageServerData & LayoutServerData;
	}

	let { data }: Props = $props();
	let { events = [], user = null, sessionData, nodesAndLinks } = data;

	let admin = $derived.by(() => {
		const url = new URL($page.url);
		return url.searchParams.get('admin') === 'true';
	});

	let title = $derived.by(() => {
		return (admin ? 'ADMIN - ' : '') + data.sessionData.name;
	});

	initStores(data.sessionData.name, nodesAndLinks.nodes, nodesAndLinks.links);

	onMount(async () => {
		await pb.collection('Session').subscribe(data.sessionData.id, (res) => {
			data.sessionData = res.record;
		});
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta content={data.sessionData.expand?.scenario.prologue} property="description" />
	<meta
		content={data.sessionData.image ? pb.files.getUrl(data.sessionData, data.sessionData.image) : graph1}
		property="og:image"
	/>
	<meta content={data.sessionData.name} property="og:title" />
	<meta content={data.sessionData.expand?.scenario.prologue} property="og:description" />
	<meta content="Babel Révolution" property="og:site_name" />
	<meta content={$page.url.href} property="og:url" />
</svelte:head>

{#if admin && user}
	<GraphUi {admin} session={sessionData} {user} {events} />
	<Watermark watermarkText="Admin">
		<ForceGraph sessionId={sessionData.id} />
	</Watermark>
{:else}
	<GraphUi {admin} session={sessionData} />
	<ForceGraph sessionId={sessionData.id} />
{/if}
