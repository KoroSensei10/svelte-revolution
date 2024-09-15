import { pb } from '$lib/pocketbase.js';
import { error } from '@sveltejs/kit';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
	id: string;
	title: string;
	text: string;
	author: string;
	type: string;
	session: string;
	side: string;
	parent: string | null | 'NULL';
}
export type Link = SimulationLinkDatum<Node>;

export interface SessionData {
	id: string;
	slug: number;
	name: string;
	creatorId: string | null;
	Nodes: {
		id: string;
		title: string;
		text: string;
		author: string;
		type: string;
		session: string;
		side: string;
		parent: string | null | 'NULL';
	}[];
	Scenario: {
		id: string;
		name: string;
		prologue: string;
		creatorId: string | null;
	};
}

async function getSession(sessionId: number) {
	const session = await pb.collection('session').getFirstListItem('slug=' + sessionId.toString());
	if (!session) error(404, {
		message: 'Session not found',
		status: 404
	});

	return session;
}

async function buildNodesAndLinks(session: any) {
	const nodes = await pb.collection('Node').getFullList({ filter: `session="${session.id}"` }) as Node[];
	const links: Link[] = [];


	nodes.forEach((node: Node) => {
		const parent = !node.parent ? null : String(node.parent);
		if (parent) {
			links.push({
				source: parent,
				target: node.id
			});
		}
	});

	return {
		nodes,
		links
	}
}

export async function load({ params }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		...sessionData,
		...nodesAndLinks
	};
}
