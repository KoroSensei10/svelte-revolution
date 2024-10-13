<svelte:options runes={true} />

<script lang="ts">
	import { onMount, untrack } from 'svelte';
	import { page } from '$app/stores';
	import { replaceState } from '$app/navigation';
	import { pb } from '$lib/client/pocketbase';
	import { initStores } from './utils';
	import GraphUi from '$components/graph/GraphUI.svelte';
	import ForceGraph from '$components/graph/ForceGraph.svelte';
	import Watermark from '$components/admin/Watermark.svelte';
	import graph1 from '$lib/assets/graphe1.png';
	import type { PageServerData } from './$types';
	import type { LayoutServerData } from '../../$types';
	import { titleStore } from '$stores/titles/index.svelte';

	interface Props {
		data: PageServerData & LayoutServerData;
	}
	let { data }: Props = $props();
	let { events = [], user = null, nodesAndLinks, ends = [], sides = [], isAdmin = false } = data;

	let sessionData = $state(data.sessionData);

	let admin = $derived($page.data.isAdmin as boolean);

	let title = $derived.by(() => {
		return (admin ? 'ADMIN - ' : '') + data.sessionData.name;
	});

	initStores(nodesAndLinks.nodes, nodesAndLinks.links);

	onMount(async () => {
		// Listen for session completion
		await pb.collection('Session').subscribe(data.sessionData.id, async (res) => {
			if (!res.record || !res.record.completed) return;
			try {
				sessionData.completed = res.record.completed;
				const end = await pb.collection('End').getOne(res.record.end ?? '');
				sessionData.expand.end = end;
			} catch (e) {
				console.error(e);
			}
		});
		// update query params with admin status
		const url = new URL(location.href);
		if (admin) {
			url.searchParams.set('admin', admin.toString());
			replaceState(url.toString(), '');
		} else {
			url.searchParams.delete('admin');
			replaceState(url.toString(), '');
		}

		titleStore.setNavTitle(title);
	});
</script>

<svelte:head>
	<title>{title}</title>
	<meta content={sessionData.expand?.scenario.prologue} property="description" />
	<meta content={sessionData.image ? pb.files.getUrl(sessionData, sessionData.image) : graph1} property="og:image" />
	<meta content={sessionData.name} property="og:title" />
	<meta content={sessionData.expand?.scenario.prologue} property="og:description" />
	<meta content="Babel Révolution" property="og:site_name" />
	<meta content={$page.url.href} property="og:url" />
</svelte:head>

{#if admin && user}
	<GraphUi {admin} session={sessionData} {user} {events} {ends} {sides} />
	<Watermark watermarkText="Admin">
		<ForceGraph sessionId={sessionData.id} />
	</Watermark>
{:else}
	<GraphUi session={sessionData} {sides} />
	<ForceGraph sessionId={sessionData.id} />
{/if}
