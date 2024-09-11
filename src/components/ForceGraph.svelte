<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { io } from 'socket.io-client';
	import type { Simulation, SimulationLinkDatum } from 'd3';
	import type { Node, SessionData } from '../routes/sessions/[slug]/+page.server';

	export let sessionId: number;
	export let nodes: Node[] = [];
	export let links: SimulationLinkDatum<Node>[] = [];

	const socket = io('');

	const width = 600;
	const height = 400;

	let svg: SVGElement;
	let selectedNode: Node | null = null; // Variable pour stocker le nœud sélectionné
	let newNodeTitle = ''; // Variable pour stocker le nom du nouveau nœud
	let newNodeText = '';

	let simulation: Simulation<Node, SimulationLinkDatum<Node>>;

	socket.on('connect', () => {
		socket.emit('join', 'room1');
	});

	socket.on(
		'newNodeServer',
		async (data: { selectedNodeId: number; newNodeTitle: string; newNodeText: string }) => {
			await addNode(data.selectedNodeId, data.newNodeTitle, data.newNodeText);
		}
	);

	// Fonction pour mettre à jour le graphe
	function updateGraph(svgElement = d3.select(svg).attr('width', width).attr('height', height)) {
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

		simulation.on('tick', () => {
			link.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => String(d.x)).attr('cy', (d) => String(d.y));

			// Positionner les labels en fonction des positions des nœuds
			labels.attr('x', (d) => String(d.x)).attr('y', (d) => String(d.y));
		});
	}

	function selectNode(node: Node) {
		selectedNode = node;
		updateGraph();
	}

	async function addNode(
		selectedNodeIdSnoup: number,
		newNodeTitleSnoup: string,
		newNodeText: string
	) {
		const newNode = {
			id: nodes.length + 1,
			title: newNodeTitleSnoup || newNodeTitle,
			text: newNodeTitleSnoup || newNodeText
		};

		nodes.push(newNode);

		const id = selectedNodeIdSnoup || selectedNode?.id;

		links.push({ source: id, target: newNode.id });

		simulation.nodes(nodes);
		simulation.force('link')?.links(links);

		simulation.alpha(1).restart();

		updateGraph();

		await addNodeToDb(newNode, id);

		console.log(newNode);

		newNodeTitle = '';
		newNodeText = '';
	}

	async function addNodeToDb(newNode: Node, id: number) {
		await fetch('/api/graph/addNode', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ newNode, selectNodeId: id, sessionId })
		});
	}

	function addNodeHook() {
		if (!selectedNode) {
			alert("Veuillez sélectionner un nœud d'abord");
			return;
		}
		if (newNodeTitle.trim() === '') {
			alert('Veuillez entrer un nom pour le nouveau nœud');
			return;
		}
		if (newNodeText.trim() === '') {
			alert('Veuillez entrer un texte pour le nouveau nœud');
			return;
		}
		socket.emit('newNodeClient', {
			selectedNodeId: selectedNode.id,
			newNodeTitle,
			newNodeText
		});
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
			.force('center', d3.forceCenter(width / 2, height / 2));

		updateGraph();
	});
</script>

<!-- Champ de texte pour le nom du nouveau nœud -->
<label for="nodeTitle">Nom du nouveau nœud :</label>
<input id="nodeTitle" bind:value={newNodeTitle} placeholder="Entrez le titre" />
<label for="nodeText">Texte du nouveau noeud :</label>
<input id="nodeText" bind:value={newNodeText} placeholder="Entrez votre texte" />

<!-- Bouton pour ajouter un nouveau nœud -->
<button on:click={addNodeHook}>Ajouter un nœud au nœud sélectionné</button>

<!-- Affichage du graphe -->
<svg bind:this={svg}></svg>
