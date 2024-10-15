<script lang="ts">
	import '../app.css';
	import { onMount, type Snippet } from 'svelte';
	import { navigating, page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { Pane, Button, Text, Textarea } from 'svelte-tweakpane-ui';
	import NProgress from 'nprogress';
	import { Toaster, toast } from 'svelte-french-toast';
	import { locale, locales, t } from 'svelte-i18n';
	import 'nprogress/nprogress.css';
	import graph1 from '$lib/assets/graphe1.png';
	import { viewportStore } from '$stores/ui/index.svelte';
	import { titleStore } from '$stores/titles/index.svelte';
	import type { User } from '$types/pocketBase/TableTypes';
	import { goto } from '$app/navigation';
	import { linksStore, nodesStore, selectedNodeStore } from '$stores/graph';
	import { pb } from '$lib/client/pocketbase';
	import { ClientResponseError } from 'pocketbase';

	type Props = {
		data: { user: User; isAdmin: boolean };
		children: Snippet;
	};
	let { data, children }: Props = $props();

	let confirmChange = $state(false);

	NProgress.configure({
		// Full list: https://github.com/rstacruz/nprogress#configuration
		minimum: 0.16
	});

	$effect.pre(() => {
		if ($navigating) {
			NProgress.start();
		} else {
			NProgress.done();
		}
	});

	onMount(() => {
		viewportStore.updateViewport(window);
	});

	function checkAuth() {
		pb.authStore.loadFromCookie(document.cookie);
		if (!pb.authStore.isValid || pb.authStore.model?.role !== 'superAdmin') {
			throw new ClientResponseError({ message: 'Not authenticated' });
		}
	}

	async function addRandomNode() {
		try {
			checkAuth();
			// génère des données aléatoires
			const data = {
				title: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
				text: crypto.getRandomValues(new Uint32Array(1))[0].toString(16),
				type: 'contribution',
				author: 'random',
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
				throw new ClientResponseError({ message: 'Cannot delete start node' });
			}
			checkAuth();
			const parent = $selectedNodeStore?.parent;
			const nodes = await pb.collection('Node').getFullList({ filter: `parent="${$selectedNodeStore?.id}"` });
			const promiseList = nodes.map((node) => {
				pb.collection('Node').update(String(node.id), { parent });
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

<svelte:head>
	<title>Babel Révolution</title>
	<meta name="description" content={$t('home.intro')} />
	<meta property="og:image" content={graph1} />
	<meta property="og:title" content="Babel Révolution" />
	<meta property="og:description" content={$t('home.intro')} />
	<meta property="og:site_name" content="Babel Révolution" />
	<meta property="og:url" content={$page.url.href} />
</svelte:head>
<svelte:window on:resize={() => viewportStore.updateViewport(window)} />

<Toaster />

{#if $page.data.user?.role === 'superAdmin'}
	<!--  && $page.url.searchParams.get('debug') === 'true'} -->
	<Pane position="draggable" title="Debug Panel">
		<Button on:click={() => goto('/roadmap')} title="Go to Roadmap"></Button>
		<Button on:click={() => window.location.reload()} title="Reload Page"></Button>
		{#if $nodesStore.length && $linksStore.length}
			{#if $selectedNodeStore}
				<Button on:click={addRandomNode} title="Add random node"></Button>
				<Button on:click={deleteNode} title="Delete node"></Button>
				<Text bind:value={$selectedNodeStore.title} label="Node title"></Text>
				<Textarea bind:value={$selectedNodeStore.text} label="Node description"></Textarea>
				<Button on:click={updateNode} title="Update node"></Button>
			{/if}
		{/if}
	</Pane>
{/if}

<!-- UI -->
<nav class="sticky top-0 z-50 border-b border-gray-500 bg-gray-950 navbar opacity-90">
	<div class="navbar-start">
		<div class="dropdown">
			<button tabindex="0" aria-label="menu" class="btn btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
				</svg>
			</button>
			<ul
				role="menu"
				tabindex="0"
				class="z-50 p-2 mt-3 bg-gray-800 shadow menu dropdown-content rounded-box w-52"
			>
				<li><a href="/">{$t('nav.home')}</a></li>
				<li><a href="/sessions">{$t('nav.sessions')}</a></li>
				{#if data.isAdmin}
					<li>
						<a href="/admin">{$t('nav.admin')}</a>
						<ul class="p-2">
							<li>
								<a href="/admin">{$t('sessions.yourSessions')}</a>
							</li>
							<li>
								<a href="/admin/scenario/create">{$t('scenario.createScenario')}</a>
							</li>
							<li>
								<a class="text-nowrap" href="/admin/sessions/create">{$t('sessions.createSession')}</a>
							</li>
						</ul>
					</li>
				{/if}
				<li><a href="/roadmap">Roadmap</a></li>
				{#if viewportStore.actualBreakpoint === 'sm'}
					<select bind:value={$locale} class="select select-ghost">
						{#each $locales as loc}
							<option class="uppercase" value={loc}>{loc.split('-')[0]}</option>
						{/each}
					</select>
				{/if}
			</ul>
		</div>
		<a href="/" class="text-xl btn btn-ghost">{titleStore.navTitle}</a>
	</div>
	<div class=" navbar-end">
		{#if viewportStore.actualBreakpoint !== 'sm'}
			<select bind:value={$locale} class="select select-ghost">
				{#each $locales as loc}
					<option value={loc}>{loc.split('-')[1]}</option>
				{/each}
			</select>
		{/if}
		{#if data.user}
			<div class="flex-none gap-2">
				<div class="z-50 dropdown dropdown-end">
					<div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
						<div class="w-10 rounded-full">
							<img alt="Tailwind CSS Navbar component" src={graph1} />
						</div>
					</div>
					<ul
						tabindex="0"
						role="menu"
						class="z-40 p-2 mt-3 bg-gray-800 shadow menu menu-sm dropdown-content rounded-box w-52"
					>
						<li class="text-gray-500">
							<a href="/" class="justify-between">
								{$t('nav.profile')}
								<span class="badge">{$t('soon')}</span>
							</a>
						</li>
						<li class="text-gray-500">
							<a href="/"
								>{$t('nav.settings')}
								<span class="badge">{$t('soon')}</span>
							</a>
						</li>
						<form
							action="/logout?/logout"
							use:enhance={() => {
								NProgress.start();
								return async ({ update }) => {
									await update({ reset: false });
									NProgress.done();
								};
							}}
							onsubmit={(e) => e.preventDefault()}
							method="post"
						>
							<button class="z-50 w-full" type="submit">{$t('nav.logout')}</button>
						</form>
					</ul>
				</div>
			</div>
		{:else}
			<a href="/login" class="justify-between btn btn-ghost">{$t('login')}</a>
		{/if}
	</div>
</nav>

<div class="inset-0 w-full text-gray-300 bg-black h-fit bg-dotted-gray bg-dotted-40">
	{@render children()}
</div>
