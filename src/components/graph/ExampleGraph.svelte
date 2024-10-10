<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import homeStore, { type ExampleNode } from '$stores/home/index.svelte';

	let svg: SVGElement;
	let svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	let nodeLayer: d3.Selection<SVGGElement, ExampleNode, null, undefined>;
	const zoom = d3.zoom().on('zoom', (e) => {
		const { transform } = e;
		nodeLayer.attr('transform', transform);
		const strokeWidth = 3 / Math.sqrt(transform.k);
		nodeLayer.style('stroke-width', strokeWidth);
	});
	let simulation: d3.Simulation<ExampleNode, d3.SimulationLinkDatum<ExampleNode>> = d3
		.forceSimulation(homeStore.nodes)
		.force(
			'link',
			d3
				.forceLink<ExampleNode, d3.SimulationLinkDatum<ExampleNode>>(homeStore.links)
				.id((d) => d.id)
				.distance(100)
		)
		.force('charge', d3.forceManyBody().strength(-300));

	onMount(() => {
		svgElement = d3.select(svg);
		nodeLayer = svgElement.append('g');
		const box = svg.getBoundingClientRect();
		const xCenter = (box.left + box.right) / 2;
		const yCenter = box.top + box.bottom / 2;

		simulation.force('center', d3.forceCenter(xCenter / 2, yCenter / 2));

		const link = nodeLayer
			.append('g')
			.selectAll('line')
			.data(homeStore.links)
			.enter()
			.append('line')
			.attr('stroke', '#999')
			.attr('stroke-width', 2);

		const node = nodeLayer
			.append('g')
			.selectAll('circle')
			.data(homeStore.nodes)
			.enter()
			.append('circle')
			.style('cursor', 'pointer')
			.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
			.on('click', (event, d) => {
				homeStore.selectedNode = d;
			})
			.attr('r', (d) => (d.id === homeStore.selectedNode?.id ? 20 : 10))
			.attr('fill', (d) => (d.id === homeStore.selectedNode?.id ? 'red' : 'yellow'));

		simulation.on('tick', () => {
			link.attr('x1', (d) => d.source.x)
				.attr('y1', (d) => d.source.y)
				.attr('x2', (d) => d.target.x)
				.attr('y2', (d) => d.target.y);

			node.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
			// TODO: move this outside of the tick event to avoid re-rendering all nodes
		});

		function dragstarted(
			event: d3.D3DragEvent<SVGElement, d3.SimulationNodeDatum, undefined>,
			d: d3.SimulationNodeDatum
		) {
			if (!event.active) simulation.alphaTarget(0.3).restart();
			d.fx = d.x;
			d.fy = d.y;
		}

		function dragged(
			event: d3.D3DragEvent<SVGElement, d3.SimulationNodeDatum, undefined>,
			d: d3.SimulationNodeDatum
		) {
			d.fx = event.x;
			d.fy = event.y;
		}

		function dragended(
			event: d3.D3DragEvent<SVGElement, d3.SimulationNodeDatum, undefined>,
			d: d3.SimulationNodeDatum
		) {
			if (!event.active) simulation.alphaTarget(0);
			d.fx = null;
			d.fy = null;
		}

		svgElement.call(zoom).call(zoom.transform, d3.zoomIdentity);
	});
</script>

<svg bind:this={svg} class="border rounded-full w-96 h-96 bg-gray-950"></svg>
