<svelte:options runes={true} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import {
		forceLink,
		forceManyBody,
		forceRadial,
		forceSimulation,
		forceX,
		forceY,
		select,
		type Selection,
		type Simulation,
		type SimulationLinkDatum,
		zoom as d3Zoom,
		zoomIdentity
	} from 'd3';
	import type { LinkMessage, NodeMessage } from '$types/graph';
	import { pb } from '$lib/pocketbase';
	import { linksStore, nodesStore, selectedNodeStore } from '$stores/graph';
	import { updateLabelsInGraph, updateLinksInGraph, updateNodesInGraph } from './utils';
	import toast from 'svelte-french-toast';
	import MessageToast from '$components/graph/MessageToast.svelte';

	interface Props {
		sessionId: string;
	}

	let { sessionId }: Props = $props();

	let svg: SVGElement;
	let svgElement: Selection<SVGElement, NodeMessage, null, undefined>;
	let nodeLayer: Selection<SVGGElement, NodeMessage, null, undefined>;
	let linkLayer: Selection<SVGGElement, NodeMessage, null, undefined>;
	let labelLayer: Selection<SVGGElement, NodeMessage, null, undefined>;

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

		const nodesInGraph = updateNodesInGraph(nodeLayer, linksInGraph, simulation);

		const labelsInGraph = updateLabelsInGraph(labelLayer, linksInGraph, nodesInGraph, simulation);

		simulation.on('tick', () => {
			if (!linksInGraph || !nodesInGraph || !labelsInGraph) {
				return;
			}
			linksInGraph
				.attr('x1', (d) => String(d.source.x))
				.attr('y1', (d) => String(d.source.y))
				.attr('x2', (d) => String(d.target.x))
				.attr('y2', (d) => String(d.target.y));

			nodesInGraph.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));
			labelsInGraph.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});

		// simulation.force('center', forceCenter(currentWidth / 2, currentHeight / 2).strength(0.8))
		simulation
			.force('centerNode', forceRadial(100, currentWidth / 2, currentHeight / 2).strength(0.02))
			.force(
				'x',
				forceX(currentWidth / 2).strength((d) => (d.type === 'startNode' ? 1 : 0))
			)
			.force(
				'y',
				forceY(currentHeight / 2).strength((d) => (d.type === 'startNode' ? 1 : 0))
			);
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
		// @ts-expect-error d3...
		simulation.force('link')?.links($linksStore);
		simulation.alpha(1).restart();
		renderGraph();
	}

	// Update the graph when a node is added
	const unsubscribe = selectedNodeStore.subscribe(() => {
		// hack to avoid the error "Cannot read property 'innerWidth' of undefined" on first render
		try {
			// eslint-disable-next-line
			window.innerWidth;
			renderGraph();
		} catch (error) {
			return error;
		}
	});

	onMount(async () => {
		await pb.collection('Node').subscribe(
			'*',
			async ({ record }) => {
				const currentUser = localStorage.getItem('author');
				if (record.author !== currentUser) {
					// @ts-expect-error Svelte 5 problem I guess
					toast(MessageToast, {
						props: {
							author: record.author,
							record
						},
						duration: 4000,
						position: 'top-left',
						style: "{backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white'}",
						icon: '📩'
					});
				}
				const side = await pb.collection('Side').getOne(record.side);
				record.expand = {};
				record.expand.side = side;
				updateGraph(record, record.parent);
			},
			{
				filter: `session="${sessionId}"`
			}
		);

		svgElement = select(svg);
		linkLayer = svgElement.append('g');
		nodeLayer = svgElement.append('g');
		labelLayer = svgElement.append('g');

		// @ts-expect-error d3...
		svgElement.call(zoom).call(zoom.transform, zoomIdentity);

		simulation = forceSimulation($nodesStore)
			.force(
				'link',
				forceLink<NodeMessage, LinkMessage>($linksStore)
					.id((d) => d.id)
					.distance((d) => {
						if (typeof d.source !== 'object' || typeof d.target !== 'object') {
							return 100;
						}
						if (d.source.type === 'startNode' || d.target.type === 'startNode') {
							return 80;
						} else if (d.source.type === 'event' || d.target.type === 'event') {
							return 100;
						}
						return 100;
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

<svg bind:this={svg} class="w-full h-full cursor-grab"></svg>
