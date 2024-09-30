import { linksStore, nodesStore } from '$stores/graph';
import { mainTitleStore } from '$stores/titles';
import type { LinkMessage, NodeMessage } from '$types/graph';

export function initStores(name: string, nodes: NodeMessage[], links: LinkMessage[]) {
	mainTitleStore.set(name);
	nodesStore.set(nodes);
	linksStore.set(links);
}
