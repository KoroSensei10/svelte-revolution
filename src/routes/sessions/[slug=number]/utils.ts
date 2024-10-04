import { linksStore, nodesStore } from '$stores/graph';
import { titles } from '$stores/titles/index.svelte';
import type { LinkMessage, NodeMessage } from '$types/graph';

export function initStores(name: string, nodes: NodeMessage[], links: LinkMessage[]) {
	titles.setMainTitle(name);
	nodesStore.set(nodes);
	linksStore.set(links);
}
