import NodeMessage from '$lib/models/Node.js';
import Scenario from '$lib/models/Scenario.js';
import Session from '$lib/models/Session.js';
import { error } from '@sveltejs/kit';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
	id: number;
	title: string;
	text: string;
}
export type Link = SimulationLinkDatum<Node>;

export interface SessionData {
	id: number;
	name: string;
	creatorId: string | null;
	Nodes: {
		id: number;
		title: string;
		text: string;
		parentId: number | null | 'NULL';
	}[];
	Scenario: {
		id: number;
		name: string;
		prologue: string;
		creatorId: string | null;
	};
}

async function getSession(sessionId: number): Promise<SessionData> {
	const session = await Session.findByPk(sessionId, { include: [NodeMessage, Scenario] });

	if (!session) error(404, {
		message: 'Session not found',
		status: 404
	});

	return session.toJSON();
}

function buildNodesAndLinks(session: SessionData) {
	const nodes: Node[] = [];
	const links: Link[] = [];

	session.Nodes.forEach((node) => {
		nodes.push({ id: node.id, title: node.title, text: node.text });
		if (node.parentId && node.parentId !== 'NULL') {
			links.push({ source: node.parentId, target: node.id });
		}
	});

	return { nodes, links };
}

export async function load({ params }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = buildNodesAndLinks(sessionData);

	return {
		...sessionData,
		...nodesAndLinks
	};
}
