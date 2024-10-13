import type { BaseNode } from '$types/graph';

function createGraphStore(badeNodes: BaseNode[], baseLinks: { source: number; target: number }[]) {
	let selectedNode: BaseNode | null = $state(badeNodes[0]);
	const nodes: BaseNode[] = $state(badeNodes);
	const links: { source: number; target: number }[] = $state(baseLinks);

	function addNode(node: BaseNode) {
		nodes.push(node);
		return node;
	}
	function addLink(link: { source: number; target: number }) {
		links.push(link);
	}

	return {
		get selectedNode() {
			return selectedNode;
		},
		set selectedNode(node: BaseNode | null) {
			selectedNode = node;
		},
		get nodes() {
			return nodes;
		},
		get links() {
			return links;
		},
		addNode,
		addLink
	};
}

export { createGraphStore };
