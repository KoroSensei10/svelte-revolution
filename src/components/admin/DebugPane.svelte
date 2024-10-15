<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/client/pocketbase';
	import { ClientResponseError } from 'pocketbase';
	import toast from 'svelte-french-toast';
	import { Pane, Button, Text, Textarea, Separator, TabGroup, TabPage } from 'svelte-tweakpane-ui';
	import { linksStore, nodesStore, selectedNodeStore } from '$stores/graph';

	function checkAuth() {
		pb.authStore.loadFromCookie(document.cookie);
		if (!pb.authStore.isValid || pb.authStore.model?.role !== 'superAdmin') {
			throw new Error('Not authenticated');
		}
	}

	async function addRandomNode() {
		const { faker } = await import('@faker-js/faker/locale/fr');
		faker.seed(new Date().getTime());
		try {
			checkAuth();
			// génère des données aléatoires
			const data = {
				title: faker.animal.fish(),
				text: faker.internet.displayName() + '! ' + faker.science.chemicalElement().name + '!',
				type: 'contribution',
				author: faker.music.songName() + ' from ' + faker.music.artist(),
				parent: $selectedNodeStore?.id,
				session: $selectedNodeStore?.session
			};

			const node = await pb.collection('Node').create(data);
			$selectedNodeStore = node;
		} catch (e) {
			console.error(e);
			const err = e as ClientResponseError;
			toast.error(err.message);
		}
	}

	async function updateNode() {
		if (!$selectedNodeStore) {
			return;
		}
		try {
			checkAuth();
			await pb.collection('Node').update(String($selectedNodeStore.id), {
				title: $selectedNodeStore.title,
				text: $selectedNodeStore.text
			});
			toast.success('Node updated');
		} catch (e) {
			const err = e as ClientResponseError;
			toast.error(err.message);
		}
	}

	async function deleteNode() {
		try {
			if ($selectedNodeStore?.type === 'startNode') {
				throw new Error('Cannot delete start node');
			}
			checkAuth();
			const newParent = $selectedNodeStore?.parent;
			if (!newParent) {
				throw new Error('No parent');
			}
			const nodes = await pb
				.collection('Node')
				.getFullList({ filter: `parent="${String($selectedNodeStore?.id)}"` });

			const promiseList = nodes.map(async (node) => {
				return pb.collection('Node').update(node.id, { parent: newParent });
			});
			await Promise.all(promiseList);
			await pb.collection('Node').delete(String($selectedNodeStore?.id));
			toast.success('Node deleted');
		} catch (e) {
			const err = e as ClientResponseError;
			toast.error(err.message);
		}
	}
</script>

<Pane position="draggable" title="Debug Panel">
	<TabGroup>
		<Separator />
		<TabPage title="Basics">
			<Button on:click={() => goto('/roadmap')} title="Go to Tasks"></Button>
			<Button on:click={() => window.location.reload()} title="Reload Page"></Button>
			{#if $nodesStore.length && $linksStore.length}
				<Button
					on:click={() => {
						const randomIndex = Math.floor(Math.random() * $nodesStore.length);
						$selectedNodeStore = $nodesStore[randomIndex];
					}}
					title="Select Random Node"
				></Button>
			{/if}
		</TabPage>
		{#if $nodesStore.length && $linksStore.length && $selectedNodeStore}
			<TabPage selected={!!$selectedNodeStore} title="Graph">
				<Button on:click={addRandomNode} title="Add random node"></Button>
				<Separator />
				<Button on:click={deleteNode} title="Delete node"></Button>
				<Separator />
				<Text bind:value={$selectedNodeStore.title} label="Node title"></Text>
				<Textarea bind:value={$selectedNodeStore.text} label="Node description"></Textarea>
				<Text disabled value={String($selectedNodeStore.id)} label="Node ID"></Text>
				<Text disabled value={String($selectedNodeStore.parent)} label="Parent ID"></Text>
				<Button on:click={updateNode} title="Update node"></Button>
			</TabPage>
		{/if}
	</TabGroup>
</Pane>
