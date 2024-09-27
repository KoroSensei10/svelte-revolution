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
		forceRadial,
		type Selection
	} from 'd3';
	import type { NodeMessage } from '$types/graph';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import { pb } from '$lib/pocketbase';
	import { linksStore, nodesStore, selectedNodeStore } from '$stores/graph';
	import { colors, nodeRadius, strokeDashArray } from './utils';

	export let sessionId: string;

	let svg: SVGElement;
	let svgElement: Selection<SVGElement, NodeMessage, null, undefined>;
	let nodeLayer: Selection<SVGElement, NodeMessage, null, undefined>;
	let linkLayer: Selection<SVGElement, NodeMessage, null, undefined>;
	let labelLayer: Selection<SVGElement, NodeMessage, null, undefined>;

	let simulation: Simulation<NodeMessage, SimulationLinkDatum<NodeMessage>>;
	export const zoom = d3Zoom().on('zoom', (e) => {
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
			.data($linksStore)
			.join('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 1)
			.attr('stroke-width', 1)
			.attr('stroke-linecap', 'round')
			.attr('stroke-linejoin', 'round')
			.attr('stroke-dashoffset', 0)
			.attr('stroke-dasharray', strokeDashArray.default);

		const node = nodeLayer
			.selectAll('circle')
			.data($nodesStore)
			.join('circle')
			.attr('draggable', true)
			.attr('r', (d) =>
				d.type === 'startNode'
					? nodeRadius.start
					: $selectedNodeStore && $selectedNodeStore.id === d.id
						? nodeRadius.selected
						: nodeRadius.default
			)
			.style('cursor', 'pointer')
			.attr('fill', (d) =>
				d.type === 'startNode'
					? colors.startNode
					: $selectedNodeStore && $selectedNodeStore.id === d.id
						? colors.selectedNode
						: colors.defaultNode
			)
			.on('mouseover', (_, d) => {
				link.attr('stroke-dasharray', (l) =>
					l.source === d || l.target === d ? strokeDashArray.hover : strokeDashArray.default
				)
					.attr('stroke', (l) => (l.source === d || l.target === d ? colors.hoverLink : colors.defaultLink))
					.attr('stroke-width', (l) => (l.source === d || l.target === d ? 2 : 1));
				node.attr('fill', (n) => {
					if (n === d) return colors.selectedNode;
					if (
						$linksStore.some(
							(l) => (l.source === d && l.target === n) || (l.target === d && l.source === n)
						)
					) {
						return colors.connectedNode;
					}
					return colors.defaultNode;
				});
			})
			.call(
				// @ts-ignore
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
				link.attr('stroke-dasharray', strokeDashArray.default)
					.attr('stroke', colors.defaultLink)
					.attr('stroke-width', 1);
				node.attr('fill', (d) =>
					d.type === 'startNode'
						? colors.startNode
						: $selectedNodeStore && $selectedNodeStore.id === d.id
							? colors.selectedNode
							: colors.defaultNode
				);
			})
			.on('click', (_, d) => selectNode(d));

		const labels = labelLayer
			.selectAll('text')
			.data($nodesStore)
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
			// @ts-ignore
			link.attr('x1', (d) => d.source.x)
				// @ts-ignore
				.attr('y1', (d) => d.source.y)
				// @ts-ignore
				.attr('x2', (d) => d.target.x)
				// @ts-ignore
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));
			labels.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});

		// simulation.force('center', forceCenter(currentWidth / 2, currentHeight / 2));
		simulation.force('centerNode', forceRadial(100, currentWidth / 2, currentHeight / 2));
	}

	/**
	 * Append a new node and his links to the graph, and update the graph
	 */
	function updateGraph(node: NodeMessage, parentNodeId: string) {
		nodesStore.update((prev) => [...prev, node]);
		linksStore.update((prev) => {
			if (parentNodeId) {
				return [...prev, { source: parentNodeId, target: node.id }];
			}
			return prev;
		});
		restartSimulation();
	}

	function selectNode(node: NodeMessage) {
		selectedNodeStore.set(node);
		renderGraph();
	}

	function restartSimulation() {
		simulation.nodes($nodesStore);
		// @ts-ignore
		simulation.force('link')?.links($linksStore);
		simulation.alpha(1).restart();
		renderGraph();
	}

	onMount(async () => {
		await pb.collection('Node').subscribe(
			'*',
			({ record }) => {
				nodesStore.update((prev) => [...prev, record]);
				updateGraph(record, record.parent);
			},
			{
				filter: `session="${sessionId}"`
			}
		);

		svgElement = select(svg);
		// @ts-ignore
		linkLayer = svgElement.append('g');
		// @ts-ignore
		nodeLayer = svgElement.append('g');
		// @ts-ignore
		labelLayer = svgElement.append('g');

		// @ts-ignore
		svgElement.call(zoom).call(zoom.transform, zoomIdentity);

		simulation = forceSimulation($nodesStore)
			.force(
				'link',
				forceLink($linksStore)
					// @ts-ignore
					.id((d) => d.id)
					.distance((d) => {
						// @ts-ignore
						if (d.source.type === 'startNode' || d.target.type === 'startNode') {
							return 30;
							// @ts-ignore
						} else if (d.source.type === 'event' || d.target.type === 'event') {
							return 50;
						}
						return 100;
					})
					.strength(0.7)
			)
			.force('charge', forceManyBody().strength(-300));

		renderGraph();
	});
</script>

<svelte:window on:resize={() => restartSimulation()} />

<svg class="w-full h-full cursor-grab" bind:this={svg}></svg>
