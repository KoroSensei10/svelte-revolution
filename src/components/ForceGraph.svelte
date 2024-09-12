<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { io } from 'socket.io-client';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import type { Node } from '../routes/sessions/[slug]/+page.server';
	import AddNode from './AddNode.svelte';

	export let sessionId: number;
	export let nodes: Node[] = [];
	export let links: SimulationLinkDatum<Node>[] = [];

	const socket = io();

	const height = window.innerHeight - 300;

	let svg: SVGElement;
	let selectedNode: Node | null = null;

	let simulation: Simulation<Node, SimulationLinkDatum<Node>>;

	socket.on('connect', () => {
		socket.emit('join', 'session' + sessionId);
	});

	socket.on(
		'newNodeServer',
		async (data: { selectedNodeId: number; nodeTitle: string; nodeText: string }) => {
			await addNode(data.selectedNodeId, data.nodeTitle, data.nodeText);
		}
	);

	function updateGraph(svgDomElement: SVGElement) {
		const svgElement = d3.select(svgDomElement);
		
		const currentWidth = parseInt(svgElement.style('width'), 10)
		svgElement.attr("width", currentWidth)
		svgElement.attr("height", height)

		// Update links
		const link = svgElement
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', (d) => Math.sqrt(d.value));

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
					.drag()
					.on('start', (event, d: Node) => {
						if (!event.active) simulation.alphaTarget(0.3).restart();
						d.fx = d.x;
						d.fy = d.y;
					})
					.on('drag', (event, d: Node) => {
						d.fx = event.x;
						d.fy = event.y;
					})
					.on('end', (event, d: Node) => {
						if (!event.active) simulation.alphaTarget(0);
						d.fx = null;
						d.fy = null;
					})
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

	function selectNode(node: Node) {
		selectedNode = node;
		updateGraph(svg);
	}

	async function addNode(selectedNodeId: number, newNodeTitle: string, newNodeText: string) {
		const newNode = {
			id: nodes.length + 1,
			title: newNodeTitle,
			text: newNodeText
		};

		nodes.push(newNode);

		const id = selectedNodeId;

		links.push({ source: id, target: newNode.id });

		simulation.nodes(nodes);
		simulation.force('link')?.links(links);

		simulation.alpha(1).restart();

		await addNodeToDb(newNode, id);

		updateGraph(svg);
	}

	async function addNodeToDb(newNode: Node, selectNodeId: number) {
		await fetch('/api/graph/addNode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ newNode, selectNodeId, sessionId })
		});
	}

	function restartSimulation() {
		simulation.nodes(nodes);
		simulation.force('link')?.links(links);
		simulation.alpha(1).restart();	
		updateGraph(svg);
	}

	onMount(() => {
		simulation = d3
			.forceSimulation(nodes)
			.force(
				'link',
				d3
					.forceLink(links)
					.id((d) => d.id)
					.distance(100)
			)
			.force('charge', d3.forceManyBody().strength(-200))

		updateGraph(svg);
	});
</script>

<svelte:window on:resize={() => restartSimulation()} />

<div class="border border-gray-300 rounded-xl m-5">
	<svg class="w-full" bind:this={svg}></svg>
</div>
<div>
	<AddNode {socket} selectedNodeId={selectedNode?.id} />
</div>
