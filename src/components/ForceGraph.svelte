<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3'; // TODO : Importer uniquement les parties nécessaires
	import { io } from 'socket.io-client';

	import type { Node } from '../routes/sessions/[slug]/+page.server';
	import AddNode from './AddNode.svelte';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import toast from 'svelte-french-toast';

	export let sessionId: number;
	export let nodes: Node[] = [];
	export let links: SimulationLinkDatum<Node>[] = [];

	const socket = io();

	let height = 500;

	let svg: SVGElement;
	let selectedNode: Node | null = null;

	let simulation: Simulation<Node, SimulationLinkDatum<Node>>;

	socket.on('connect', () => {
		socket.emit('join', 'session' + sessionId);
	});

	socket.on('newNodeServer', async ({ node, parentNodeId }) => {
		console.log('newNodeServer', node, parentNodeId);
		updateGraph(node, parentNodeId);
	});

	function renderGraph() {
		const svgElement = d3.select(svg);

		const currentWidth = parseInt(svgElement.style('width'), 10);
		svgElement.attr('width', currentWidth);
		svgElement.attr('height', height);

		// Update links
		const link = svgElement
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', (d) => Math.sqrt(Number(d.index || 0 + 1)));

		// Update nodes
		const node = svgElement
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('draggable', true)
			.attr('r', 10)
			.attr('fill', (d) =>
				selectedNode && selectedNode.id === d.id ? 'red' : d3.schemeCategory10[0]
			) // Colorie en rouge si sélectionné
			.on('mouseover', (event, d) => {
				// Mettre en surbrillance les nœuds liés
				link.attr('stroke', (l) => (l.source === d || l.target === d ? 'red' : '#999'));
				node.attr('fill', (n) => (n === d ? 'red' : d3.schemeCategory10[0]));
				node.style('cursor', 'pointer');
			})
			.call(
				d3
					.drag<any, Node>()
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
				// Réinitialiser la couleur des liens
				link.attr('stroke', '#999');
				node.attr('fill', (d) =>
					selectedNode && selectedNode.id === d.id ? 'red' : d3.schemeCategory10[0]
				);
			})
			.on('click', (event, d) => selectNode(d));

		// Ajouter des labels de texte pour chaque nœud
		const labels = svgElement
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('text-anchor', 'middle')
			.attr('dy', -20) // Positionne le texte au-dessus du nœud
			.text((d) => d.title);

		// Update simulation
		simulation.on('tick', () => {
			link.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));

			// Positionner les labels en fonction des positions des nœuds
			labels.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});

		simulation.force('center', d3.forceCenter(currentWidth / 2, height / 2));
	}

	function updateGraph(node: Node, parentNodeId: number) {
		nodes.push(node);
		links.push({ source: parentNodeId, target: node.id });
		restartSimulation();
	}

	async function addNode(title: string, text: string, parentNodeId: number) {
		const newNode = await addNodeToDb(title, text, parentNodeId);
		
		socket.emit('newNodeClient', { node: newNode, parentNodeId });

		updateGraph(newNode, parentNodeId);

		toast.success('Nœud ajouté avec succès', {
			position: 'bottom-center',
		});
	}

	async function addNodeToDb(title: string, text: string, selectNodeId: number) {
		const response = await fetch('/api/graph/addNode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ newNode: {
				title,
				text
			}, selectNodeId, sessionId })
		});
		return response.json() as Promise<Node>;
	}

	function selectNode(node: Node) {
		selectedNode = node;
		renderGraph();
	}

	function restartSimulation() {
		simulation.nodes(nodes);
		simulation.force('link')?.links(links);
		simulation.alpha(1).restart();
		renderGraph();
	}

	onMount(() => {
		height = window.innerHeight - 300;
		simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d) => d.id)
					.distance(100)
			)
			.force('charge', d3.forceManyBody().strength(-300));
		renderGraph();
	});
</script>

<svelte:window on:resize={() => restartSimulation()} />

<div class="border border-gray-300 rounded-xl m-5">
	<svg class="w-full" bind:this={svg}></svg>
</div>
<div>
	<AddNode addnode={addNode} selectedNodeId={selectedNode?.id} />
</div>
