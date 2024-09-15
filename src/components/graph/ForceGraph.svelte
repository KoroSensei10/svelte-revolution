<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3'; // TODO : Importer uniquement les parties nécessaires

	import type { Node as NodeMessage } from '../../routes/sessions/[slug]/+page.server';
	import UI from './GraphUI.svelte';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import toast from 'svelte-french-toast';
	import { pb } from '$lib/pocketbase';

	export let sessionId: string;
	export let nodes: NodeMessage[] = [];
	export let links: SimulationLinkDatum<NodeMessage>[] = [];

	let svg: SVGElement;
	let svgElement: d3.Selection<SVGElement, unknown, null, undefined>;
	let g: d3.Selection<SVGElement, unknown, null, undefined>;
	let simulation: Simulation<NodeMessage, SimulationLinkDatum<NodeMessage>>;

	let transform;
	const zoom = d3.zoom().on('zoom', (e) => {
		g.attr('transform', (transform = e.transform));
		g.style('stroke-width', 3 / Math.sqrt(transform.k));
	});

	let selectedNode: NodeMessage | null = null;

	function renderGraph() {
		const currentWidth = window.innerWidth;
		const currentHeight = window.innerHeight;
		svgElement.attr('width', currentWidth);
		svgElement.attr('height', currentHeight);

		// Update links
		const link = g
			.selectAll('line')
			.data(links)
			.join('line')
			.attr('stroke', '#999')
			.attr('stroke-opacity', 0.6)
			.attr('stroke-width', (d) => Math.sqrt(Number(d.index || 0 + 1)));

		// Update nodes
		const node = g
			.selectAll('circle')
			.data(nodes)
			.join('circle')
			.attr('draggable', true)
			.attr('r', 10)
			.attr('fill', (d) => (selectedNode && selectedNode.id === d.id ? 'red' : d3.schemeCategory10[0])) // Colorie en rouge si sélectionné
			.on('mouseover', (event, d) => {
				// Mettre en surbrillance les nœuds liés
				link.attr('stroke', (l) => (l.source === d || l.target === d ? 'red' : '#999'));
				node.attr('fill', (n) => (n === d ? 'red' : d3.schemeCategory10[0]));
				node.style('cursor', 'pointer');
			})
			.call(
				d3
					.drag<any, NodeMessage>()
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
				node.attr('fill', (d) => (selectedNode && selectedNode.id === d.id ? 'red' : d3.schemeCategory10[0]));
			})
			.on('click', (event, d) => selectNode(d));

		// Ajouter des labels de texte pour chaque nœud
		const labels = g
			.selectAll('text')
			.data(nodes)
			.join('text')
			.attr('text-anchor', 'middle')
			.attr('dy', -20) // Positionne le texte au-dessus du nœud
			.classed('fill-white', true)
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

		simulation.force('center', d3.forceCenter(currentWidth / 2, currentHeight / 2));
	}

	function updateGraph(node: NodeMessage, parentNodeId: string) {
		nodes.push(node);
		links.push({ source: parentNodeId, target: node.id });
		restartSimulation();
	}

	async function addNode(title: string, text: string, author: string, parentNodeId: sring) {
		await pb.collection('Node').create({
			title,
			text,
			author,
			type: 'contribution',
			parent: parentNodeId,
			session: sessionId
		});

		toast.success('Nœud ajouté avec succès', {
			position: 'bottom-center'
		});
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

		svgElement = d3.select(svg);
		g = svgElement.append('g');

		svgElement.call(zoom).call(zoom.transform, d3.zoomIdentity);

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

<UI addnode={addNode} selectedNodeId={selectedNode?.id} />
<svg class="w-full h-full cursor-grab" bind:this={svg}></svg>
