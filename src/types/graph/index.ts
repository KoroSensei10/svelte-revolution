import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

export interface NodeMessage extends SimulationNodeDatum {
	id: string;
	title: string;
	text: string;
	author: string;
	type: string;
	session: string;
	side: string;
	parent: string | null | 'NULL';
}
export type Link = SimulationLinkDatum<NodeMessage>;

export interface SessionData {
	id: string;
	slug: number;
	name: string;
	creatorId: string | null;
	Nodes: NodeMessage[];
	Scenario: {
		id: string;
		name: string;
		prologue: string;
		creatorId: string | null;
	};
}
