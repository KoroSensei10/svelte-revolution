import type { LinkMessage } from '$types/graph';
import type { GraphNode } from '$types/pocketBase/TableTypes';

export function buildLinks(nodes: GraphNode[]) {
	const links: LinkMessage[] = [];

	for (const node of nodes) {
		const parent = nodes.find((n) => n.id === node.parent);
		if (parent) {
			links.push({
				source: parent,
				target: node
			});
		}
	}

	return links;
}
