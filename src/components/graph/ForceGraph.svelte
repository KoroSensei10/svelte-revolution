<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		select,
		zoom as d3Zoom,
		zoomIdentity,
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
	import { updateLabelsInGraph, updateLinksInGraph, updateNodesInGraph } from './utils';

	export let sessionId: string;

	let svg: SVGElement;
	let svgElement: Selection<SVGElement, NodeMessage, null, undefined>;
	let nodeLayer: Selection<SVGElement, NodeMessage, null, undefined>;
	let linkLayer: Selection<SVGElement, NodeMessage, null, undefined>;
	let labelLayer: Selection<SVGElement, NodeMessage, null, undefined>;

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
		const currentWidth = window?.innerWidth || 500;
		const currentHeight = window?.innerHeight || 500;
		svgElement.attr('width', currentWidth).attr('height', currentHeight);

		const linksInGraph = updateLinksInGraph(linkLayer);
		// @ts-ignore
		const nodesInGraph = updateNodesInGraph(nodeLayer, linksInGraph, simulation);
		// @ts-ignore
		const labelsInGraph = updateLabelsInGraph(labelLayer, linksInGraph, nodesInGraph);

		simulation.on('tick', () => {
			// @ts-ignore
			linksInGraph
				// @ts-ignore
				.attr('x1', (d) => d.source.x)
				// @ts-ignore
				.attr('y1', (d) => d.source.y)
				// @ts-ignore
				.attr('x2', (d) => d.target.x)
				// @ts-ignore
				.attr('y2', (d) => d.target.y);

			nodesInGraph.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));
			labelsInGraph.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});

		// simulation.force('center', forceCenter(currentWidth / 2, currentHeight / 2));
		simulation.force('centerNode', forceRadial(100, currentWidth / 2, currentHeight / 2));
	}

	/**
	 * Append a new node and his links to the graph, then restart the simulation
	 */
	function updateGraph(node: NodeMessage, parentNodeId: string) {
		nodesStore.set([...$nodesStore, node]);
		linksStore.set([
			...$linksStore,
			{
				source: parentNodeId,
				target: node.id
			}
		]);
		restartSimulation();
	}

	function restartSimulation() {
		simulation.nodes($nodesStore);
		// @ts-ignore
		simulation.force('link')?.links($linksStore);
		simulation.alpha(1).restart();
		renderGraph();
	}

	// Update the graph when a node is added
	const unsubscribe = selectedNodeStore.subscribe(() => {
		// hack to avoid the error "Cannot read property 'innerWidth' of undefined" on first render
		try {
			const _ = window;
			renderGraph();
		} catch (error) {
			return error;
		}
	});

	onMount(async () => {
		await pb.collection('Node').subscribe(
			'*',
			({ record }) => {
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
							return 50;
							// @ts-ignore
						} else if (d.source.type === 'event' || d.target.type === 'event') {
							return 80;
						}
						return 130;
					})
					.strength(1)
			)
			.force('charge', forceManyBody().strength(-300));

		renderGraph();
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<svelte:window on:resize={() => restartSimulation()} />

<svg class="w-full h-full cursor-grab" bind:this={svg}></svg>
