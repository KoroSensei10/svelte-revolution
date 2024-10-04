import { linksStore, nodesStore } from '$stores/graph';
import type { LinkMessage, NodeMessage } from '$types/graph';

export function initStores(nodes: NodeMessage[], links: LinkMessage[]) {
	nodesStore.set(nodes);
	linksStore.set(links);
}
