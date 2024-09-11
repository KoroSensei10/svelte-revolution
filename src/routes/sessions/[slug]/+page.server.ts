import Message from '$lib/models/Message.js';
import Scenario from '$lib/models/Scenario.js';
import Session from '$lib/models/Session.js';
import { error } from '@sveltejs/kit';
import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface Node extends SimulationNodeDatum {
	id: number;
	name: string;
}
export type Link = SimulationLinkDatum<Node>;

async function getSession(sessionId: number) {
	const session = await Session.findByPk(sessionId, { include: [Message, Scenario] });

	if (!session) throw error(404);

	return session.toJSON();
}

function buildNodesAndLinks(session: any): { nodes: Node[]; links: Link[] } {
	const nodes: Node[] = [];
	const links: Link[] = [];

	session.messages.forEach((message: any) => {
		nodes.push({ id: message.id, name: message.title });
		if (message.parentId) {
			links.push({ source: message.parentId, target: message.id });
		}
	});

	return { nodes, links };
}

export async function load({ params }) {
	// TODO : dépendre de params.slug
	const sessoinData = await getSession(1);

	const nodesAndLinks = buildNodesAndLinks(sessoinData);
	console.log(nodesAndLinks);

	return nodesAndLinks;
}
