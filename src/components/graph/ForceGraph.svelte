<script lang="ts">
	import { onMount } from 'svelte';
	import {
		select,
		zoom as d3Zoom,
		zoomIdentity,
		drag,
		forceSimulation,
		forceLink,
		forceManyBody,
		schemeCategory10,
		forceRadial
	} from 'd3';
	import type { Node as NodeMessage } from '../../routes/sessions/[slug]/+page.server';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import { pb } from '$lib/pocketbase';
	import type { NodeType } from '../../../types/tableTypes';

	export let sessionId: string;
	export let nodes: NodeMessage[] = [];
	export let links: SimulationLinkDatum<NodeMessage>[] = [];
	export let selectedNode: NodeType | null = null;

	let svg: SVGElement;
	let svgElement: d3.Selection<SVGElement, unknown, null, undefined>;
	let nodeLayer: d3.Selection<SVGElement, unknown, null, undefined>;
	let linkLayer: d3.Selection<SVGElement, unknown, null, undefined>;
	let labelLayer: d3.Selection<SVGElement, unknown, null, undefined>;

	let simulation: Simulation<NodeMessage, SimulationLinkDatum<NodeMessage>>;

	const zoom = d3Zoom().on('zoom', (e) => {
		const { transform } = e;
		nodeLayer.attr('transform', transform);
		linkLayer.attr('transform', transform);
		labelLayer.attr('transform', transform);
		const strokeWidth = 3 / Math.sqrt(transform.k);
		nodeLayer.style('stroke-width', strokeWidth);
		linkLayer.style('stroke-width', strokeWidth);
		labelLayer.style('stroke-width', strokeWidth);
	});

	function renderGraph() {
		const currentWidth = window.innerWidth;
		const currentHeight = window.innerHeight;
		svgElement.attr('width', currentWidth).attr('height', currentHeight);

		const link = linkLayer
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 1)
			.attr('stroke-width', 1)
			.attr('stroke-linecap', 'round')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-dashoffset', 0)
			.attr('stroke-dasharray', '5, 15');

		const node = nodeLayer
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('draggable', true)
			.attr('r', (d) => {
				if (d.type === 'startNode') {
					return 30;
				}
				return selectedNode && selectedNode.id === d.id ? 15 : 10;
			})
			.style('cursor', 'pointer')
			.attr('fill', (d) => {
				if (d.type === 'startNode') {
					return 'green';
				}
				return selectedNode && selectedNode.id === d.id ? 'red' : schemeCategory10[0];
			})
			.on('mouseover', (_, d) => {
				link.attr('stroke-dasharray', (l) => (l.source === d || l.target === d ? 'none' : '5, 15'));
				link.attr('stroke', (l) => (l.source === d || l.target === d ? 'red' : '#999'));
				link.attr('stroke-width', (l) => (l.source === d || l.target === d ? 2 : 1));
				node.attr('fill', (n) => {
					if (n === d) return 'red';
					if (links.some((l) => (l.source === d && l.target === n) || (l.target === d && l.source === n))) {
						return 'purple';
					}
					return schemeCategory10[0];
				});
			})
			.call(
				drag<any, NodeMessage>()
					.on('start', (event, d) => {
						if (!event.active) simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on('drag', (event, d) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on('end', (event, d) => {
						if (!event.active) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					}),
				null
			)
			.on('mouseout', () => {
				link.attr('stroke-dasharray', '5, 15');
				link.attr('stroke', '#999');
				link.attr('stroke-width', 1);
				node.attr('fill', (d) => {
					if (d.type === 'startNode') {
						return 'green';
					}
					return selectedNode && selectedNode.id === d.id ? 'red' : schemeCategory10[0];
				});
			})
			.on('click', (_, d) => selectNode(d));

		const labels = labelLayer
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('text-anchor', 'middle')
			.attr('dy', (d) => {
				return d.type !== 'startNode' ? -20 : 5;
			})
			.classed('fill-white', true)
			// .style('font-size', '10px') TODO personalize font size
			.text((d) => d.title)
			.on('click', (_, d) => selectNode(d))
			.style('cursor', 'pointer');
		// TODO: corriger le hover sur le texte pour être comme le hover sur le noeud

		simulation.on('tick', () => {
			link.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));
			labels.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});

		// simulation.force('center', forceCenter(currentWidth / 2, currentHeight / 2));
	}

	function updateGraph(node: NodeMessage, parentNodeId: string) {
		nodes.push(node);
		links.push({ source: parentNodeId, target: node.id });
		restartSimulation();
	}

	function selectNode(node: NodeMessage) {
		selectedNode = node;
		renderGraph();
	}

	function restartSimulation() {
		simulation.nodes(nodes);
		simulation.force('link')?.links(links);
		simulation.alpha(1).restart();
		renderGraph();
	}

	onMount(async () => {
		await pb.collection('Node').subscribe(
			'*',
			({ record }) => {
				nodes = [...nodes, record];
				updateGraph(record, record.parent);
			},
			{
				filter: `session="${sessionId}"`
			}
		);

		const currentWidth = window.innerWidth;
		const currentHeight = window.innerHeight;

		svgElement = select(svg);
		linkLayer = svgElement.append('g');
		nodeLayer = svgElement.append('g');
		labelLayer = svgElement.append('g');

		svgElement.call(zoom).call(zoom.transform, zoomIdentity);

		const startNode = nodes.find((n) => n.type === 'startNode');

		simulation = forceSimulation(nodes)
			.force(
				'link',
				forceLink(links)
					.id((d) => d.id)
					.distance((d) => {
						if (d.source.type === 'startNode' || d.target.type === 'startNode') {
							return 30;
						} else if (d.source.type === 'event' || d.target.type === 'event') {
							return 50;
						}
						return 100;
					})
					.strength(0.7)
			)
			.force('charge', forceManyBody().strength(-300))
			.force('centerNode', forceRadial(100, currentWidth / 2, currentHeight / 2));

		renderGraph();
	});
</script>

<svelte:window on:resize={() => restartSimulation()} />

<svg class="w-full h-full cursor-grab" bind:this={svg}></svg>
