import type { LinkMessage, NodeMessage } from '$types/graph';

function createGraphStore() {
	let selectedNode: NodeMessage | null = $state(null);
	let nodes: NodeMessage[] = $state([]);
	let links: LinkMessage[] = $state([]);

	function addNode(node: NodeMessage) {
		nodes.push(node);
	}
	function addLink(node: NodeMessage, parent: NodeMessage | null) {
		if (node === parent) return;
		if (!parent) return;
		links.push({ source: node, target: parent });
	}

	return {
		get nodes() {
			return nodes;
		},
		get selectedNode() {
			return selectedNode;
		},
		get links() {
			return links;
		},
		set nodes(newNodes: NodeMessage[]) {
			nodes = newNodes;
		},
		set selectedNode(newSelectedNode: NodeMessage | null) {
			selectedNode = newSelectedNode;
		},
		set links(newLinks: LinkMessage[]) {
			links = newLinks;
		},
		addNode,
		addLink
	};
}

export const graphStore = createGraphStore();
