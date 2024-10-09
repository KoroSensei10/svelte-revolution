<script lang="ts">
	import { onMount } from 'svelte';
	import * as d3 from 'd3';
	import { t } from 'svelte-i18n';

	interface ExampleNode extends d3.SimulationNodeDatum {
		id: number;
		title: string;
		text: string;
	}

	const nodes: ExampleNode[] = [
		{
			id: 1,
			title: 'Node 1',
			text: 'Node 1 text'
		},
		{
			id: 2,
			title: 'Node 2',
			text: 'Node 2 text'
		},
		{
			id: 3,
			title: 'Node 3',
			text: 'Node 3 text'
		},
		{
			id: 4,
			title: 'Node 4',
			text: 'Node 4 text'
		},
		{
			id: 5,
			title: 'Node 5',
			text: 'Node 5 text'
		}
	];

	const links = [
		{ source: 1, target: 2 },
		{ source: 1, target: 3 },
		{ source: 2, target: 4 },
		{ source: 3, target: 5 }
	];

	let selectedNode: ExampleNode = $state(nodes[0]);

	let svg: SVGElement;
	let svgElement: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	let simulation: d3.Simulation<ExampleNode, d3.SimulationLinkDatum<ExampleNode>> = d3
		.forceSimulation(nodes)
		.force(
			'link',
			d3
				.forceLink<ExampleNode, d3.SimulationLinkDatum<ExampleNode>>(links)
				.id((d) => d.id)
				.distance(100)
		)
		.force('charge', d3.forceManyBody().strength(-300));

	onMount(() => {
		svgElement = d3.select(svg);
		const box = svg.getBoundingClientRect();
		const xCenter = (box.left + box.right) / 1.4;
		const yCenter = box.top + box.bottom / 1.6;

		simulation.force('center', d3.forceCenter(xCenter / 2, yCenter / 2));

		const link = svgElement
			.append('g')
			.selectAll('line')
			.data(links)
			.enter()
			.append('line')
			.attr('stroke', '#999')
			.attr('stroke-width', 2);

		const node = svgElement
			.append('g')
			.selectAll('circle')
			.data(nodes)
			.enter()
			.append('circle')
			.style('cursor', 'pointer')
			.call(d3.drag().on('start', dragstarted).on('drag', dragged).on('end', dragended))
			.on('click', (event, d) => {
				selectedNode = d;
			})
			.attr('r', (d) => (d.id === selectedNode.id ? 20 : 10))
			.attr('fill', (d) => (d.id === selectedNode.id ? 'red' : 'yellow'));

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
	});
</script>

<div class="flex items-center justify-center w-full h-screen">
	<div class="flex w-full gap-4 p-4 h-2/3">
		<svg bind:this={svg} class="w-2/3 border rounded"></svg>
		<div class="flex flex-col self-start w-1/3 gap-4">
			<h1 class="text-center">Introduction à Babel Révolution</h1>
			<div class="border rounded collapse collapse-plus sm:collapse-arrow">
				<input checked={true} class="" name="GraphUI" type="checkbox" />
				<div class="font-bold collapse-title">
					{$t('nodeInformation')}
				</div>
				<div class="text-white collapse-content">
					{#if selectedNode}
						<div class="text-xl font-semibold first-letter:capitalize">{selectedNode.title}</div>
						<div class="pl-1 overflow-auto max-h-44">{selectedNode.text}</div>
					{:else}
						<div class="pb-0 text-xl text-center first-letter:capitalize">{$t('noNodeSelected')}</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
