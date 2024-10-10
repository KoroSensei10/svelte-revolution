class HomeStore {
	selectedNode: null | { id: number } = $state(null);
	nodes: { id: number; text: string; title: string }[] = $state([]);
	links: { source: number; target: number }[] = $state([]);

	constructor(nodes: { id: number }[], links: { source: number; target: number }[]) {
		this.nodes = nodes;
		this.links = links;
		this.selectedNode = nodes[0];
	}

	setSelectedNode(node: { id: number }) {
		this.selectedNode = node;
	}

	setNodes(nodes: { id: number }[]) {
		this.nodes = nodes;
	}

	setLinks(links: { source: number; target: number }[]) {
		this.links = links;
	}
}

export interface ExampleNode extends d3.SimulationNodeDatum {
	id: number;
	title: string;
	text: string;
}

const nodes: ExampleNode[] = [
	{
		id: 1,
		title: 'Introduction',
		text: 'Babel est une plateforme de développement de logiciels qui permet aux développeurs de créer des applications web et mobiles en utilisant des technologies modernes telles que React, Vue, Svelte, TypeScript, Tailwind CSS, Express, MongoDB, PostgreSQL, etc.'
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

const homeStore = new HomeStore(nodes, links);

homeStore.setNodes(nodes);

export default homeStore;
