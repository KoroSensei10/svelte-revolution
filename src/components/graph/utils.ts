import { linksStore, nodesStore, selectedNodeStore } from '$stores/graph';
import type { Link, NodeMessage } from '$types/graph';
import { drag } from 'd3';
import { get } from 'svelte/store';

export const colors = {
	startNode: '#1b3022',
	selectedNode: 'red',
	defaultNode: '#86efac',
	defaultLink: '#999',
	hoverLink: 'red',
	connectedNode: 'purple'
};

export const strokeDashArray = {
	default: '5, 15',
	hover: 'none'
};

export const nodeRadius = {
	default: 10,
	selected: 15,
	start: 30
};

function selectNode(node: NodeMessage) {
	selectedNodeStore.set(node);
}

export const updateLabelsInGraph = (
	labelLayer: d3.Selection<SVGElement, NodeMessage, SVGElement, NodeMessage>,
	linksInGraph: any,
	updatedNodes: any
) => {
	const links = get(linksStore);
	const selectedNode = get(selectedNodeStore);
	return labelLayer
		.selectAll('text')
		.data(get(nodesStore))
		.join('text')
		.attr('text-anchor', 'middle')
		.attr('dy', (d) => {
			return d.type !== 'startNode' ? -13 : 5;
		})
		.classed('fill-white', true)
		.style('font-size', '18px') // TODO personalize font size
		.text((d) => d.title)
		.on('click', (_, d) => selectNode(d))
		.style('cursor', 'pointer')
		.on('mouseover', (_, d) => handleMouseOver(d, linksInGraph, updatedNodes, links))
		.on('mouseout', () => handleMouseOut(linksInGraph, updatedNodes, selectedNode));
};

export const updateLinksInGraph = (linkLayer: d3.Selection<SVGElement, NodeMessage, null, undefined>) => {
	return linkLayer
		.selectAll('line')
		.data(get(linksStore))
		.join('line')
		.attr('stroke', '#999')
		.attr('stroke-opacity', 1)
		.attr('stroke-width', 1)
		.attr('stroke-linecap', 'round')
		.attr('stroke-linejoin', 'round')
		.attr('stroke-dashoffset', 0)
		.attr('stroke-dasharray', strokeDashArray.default);
};

export const updateNodesInGraph = (
	nodeLayer: d3.Selection<SVGElement, NodeMessage, null, undefined>,
	linksInGraph: d3.Selection<SVGElement, NodeMessage, null, undefined>,
	simulation: d3.Simulation<NodeMessage, Link>
) => {
	const nodes = get(nodesStore);
	const selectedNode = get(selectedNodeStore);
	const links = get(linksStore);

	const updatedNodes = nodeLayer
		.selectAll('circle')
		.data(nodes)
		.join('circle')
		.attr('draggable', true)
		.attr('r', (d) => getNodeRadius(d, selectedNode))
		.style('cursor', 'pointer')
		.attr('fill', (d) => getNodeColor(d, selectedNode))
		.on('mouseover', (_, d) => handleMouseOver(d, linksInGraph, updatedNodes, links))
		.on('mouseout', () => handleMouseOut(linksInGraph, updatedNodes, selectedNode))
		.call(
			drag<any, NodeMessage>()
				.on('start', (event, d) => handleDragStart(event, d, simulation))
				.on('drag', (event, d) => handleDrag(event, d))
				.on('end', (event, d) => handleDragEnd(event, d, simulation)),
			null
		)
		.on('click', (_, d) => selectNode(d));

	return updatedNodes;
};

const getNodeRadius = (d: NodeMessage, selectedNode: NodeMessage | null) => {
	if (d.type === 'startNode') {
		return nodeRadius.start;
	} else if (selectedNode && selectedNode.id === d.id) {
		return nodeRadius.selected;
	} else {
		return nodeRadius.default;
	}
};

const getNodeColor = (d: NodeMessage, selectedNode: NodeMessage | null) => {
	if (d.type === 'startNode') {
		return colors.startNode;
	}
	if (selectedNode && selectedNode.id === d.id) {
		return colors.selectedNode;
	}
	return colors.defaultNode;
};

const handleMouseOver = (
	d: NodeMessage,
	linksInGraph: d3.Selection<SVGElement, NodeMessage, null, Link>,
	updatedNodes: d3.Selection<SVGElement, NodeMessage, null, Link>,
	links: Link[]
) => {
	linksInGraph
		.attr('stroke-dasharray', (l) =>
			l.source === d || l.target === d ? strokeDashArray.hover : strokeDashArray.default
		)
		.attr('stroke', (l) => (l.source === d || l.target === d ? colors.hoverLink : colors.defaultLink))
		.attr('stroke-width', (l) => (l.source === d || l.target === d ? 2 : 1));

	updatedNodes.attr('fill', (n) => {
		if (n === d) return colors.selectedNode;
		if (links.some((l) => (l.source === d && l.target === n) || (l.target === d && l.source === n))) {
			return colors.connectedNode;
		} else if (n.type === 'startNode') {
			return colors.startNode;
		}
		return colors.defaultNode;
	});
};

const handleMouseOut = (
	linksInGraph: d3.Selection<SVGElement, NodeMessage, null, undefined>,
	updatedNodes: d3.Selection<SVGElement, NodeMessage, null, undefined>,
	selectedNode: NodeMessage | null
) => {
	linksInGraph
		.attr('stroke-dasharray', strokeDashArray.default)
		.attr('stroke', colors.defaultLink)
		.attr('stroke-width', 1);
	updatedNodes.attr('fill', (d) => getNodeColor(d, selectedNode));
};

const handleDragStart = (
	event: d3.D3DragEvent<SVGElement, NodeMessage, NodeMessage>,
	d: NodeMessage,
	simulation: d3.Simulation<NodeMessage, undefined>
) => {
	if (!event.active) simulation.alphaTarget(0.3).restart();
	d.fx = d.x;
	d.fy = d.y;
};

const handleDrag = (event: d3.D3DragEvent<SVGElement, NodeMessage, NodeMessage>, d: NodeMessage) => {
	d.fx = event.x;
	d.fy = event.y;
};

const handleDragEnd = (
	event: d3.D3DragEvent<SVGElement, NodeMessage, NodeMessage>,
	d: NodeMessage,
	simulation: d3.Simulation<NodeMessage, undefined>
) => {
	if (!event.active) simulation.alphaTarget(0);
	d.fx = null;
	d.fy = null;
};
