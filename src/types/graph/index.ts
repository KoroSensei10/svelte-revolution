import type { SimulationLinkDatum, SimulationNodeDatum } from 'd3';
import type { GraphNode } from '$types/pocketBase/TableTypes';

export type BaseNode = SimulationNodeDatum & {
	id: string | number;
	title: string;
	text: string;
};

export type NodeMessage = GraphNode & SimulationNodeDatum;

export type LinkMessage = SimulationLinkDatum<NodeMessage> & {
	source: NodeMessage;
	target: NodeMessage;
};
