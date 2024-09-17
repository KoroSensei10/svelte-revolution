import { pb } from '$lib/pocketbase.js';
import { error } from '@sveltejs/kit';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import { ClientResponseError } from 'pocketbase';

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
	let session: SessionData;
	try {
		session = await pb.collection('session').getFirstListItem('slug=' + sessionId.toString());
	} catch (e) {
		const err = e as ClientResponseError;
		if (err.status === 404) {
			error(404, {
				status: 404,
				message: 'Session not found'
			});
		} else {
			error(500, {
				status: err.status,
				message: err.message
			});
		}
	}

	return session;
}

async function buildNodesAndLinks(session: SessionData) {
	const nodes = (await pb.collection('Node').getFullList({ filter: `session="${session.id}"` })) as Node[];
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
	};
}

export async function load({ params }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		...sessionData,
		...nodesAndLinks
	};
}
