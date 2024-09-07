import { error } from '@sveltejs/kit';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
	id: number;
	name: string;
}

let nodes: Node[] = [
	{ id: 1, name: 'A' },
	{ id: 2, name: 'B' },
	{ id: 3, name: 'C' }
];

let links: SimulationLinkDatum<Node>[] = [
	{ source: 1, target: 2 },
	{ source: 2, target: 3 },
	{ source: 3, target: 1 }
];

export function load({ params }) {
	// const post = posts.find((post) => post.slug === params.slug);
	// if (!post) throw error(404);
	return {
		nodes,
		links
	};
}
