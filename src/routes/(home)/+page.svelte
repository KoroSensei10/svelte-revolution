<script lang="ts">
	import { onMount } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';
	import { replaceState } from '$app/navigation';
	import ExampleGraph from '$components/graph/ExampleGraph.svelte';
	import { typewriter } from '$lib/animations';
	import { t, locale } from 'svelte-i18n';
	import { homeStore } from '$stores/home/index.svelte';
	import { titleStore } from '$stores/titles/index.svelte';
	import toast from 'svelte-french-toast';

	import graph1 from '$lib/assets/graphe1.png';
	import Sessions from '$components/listing/Sessions.svelte';

	let visible = $state(false);
	let graphIntro = $state(true);
	let userMessage = $state('');

	let { data } = $props();

	// Hack to force the graph to reload when the locale changes
	let reloadGraph = $derived(String(homeStore.nodes.length) + String($locale));

	function submitUserMessage(e: SubmitEvent) {
		e.preventDefault();
		if (userMessage) {
			const id = homeStore.nodes.length + 1;
			const node = homeStore.addNode({
				id,
				title: 'home.yourMessage',
				text: userMessage
			});
			homeStore.addLink({ source: id, target: homeStore.selectedNode?.id ?? 3 });
			userMessage = '';
			homeStore.selectedNode = node;
		} else {
			toast.error($t('home.emptyMessage'));
		}
	}

	onMount(() => {
		visible = true;

		const url = new URL(window.location.href);
		const newUrl = url.toString().split('#');
		if (newUrl[1]) {
			replaceState(newUrl[0], {});
		}

		titleStore.setNavTitle('Babel Revolution');
	});
</script>

<div class="flex flex-col items-center w-full gap-12 px-4">
	<section class="flex flex-col items-center w-full gap-6 p-8 pb-0 md:w-2/3">
		<h1 class="pb-0 text-nowrap max-md:text-4xl">
			{#if visible}
				<span in:typewriter|global={{ text: 'BⱯBEL RËVOLUㅏION' }} class="text-white"></span>
				<span class="blinking-underscore">_</span>
			{:else}
				<span class="invisible">BABEL REVOLUTION</span>
			{/if}
		</h1>
		<div class="text-lg text-center text-gray-300">
			{$t('home.intro')}
			<p class="text-white">
				{$t('home.introHighlight')}
				<span class="underline text-primary-500 text-nowrap underline-offset-4"
					>{$t('home.introHyperHighlight')}</span
				>
			</p>
		</div>
		<div id="intro" class="flex gap-4">
			<a class="btn dark:bg-white dark:text-black hover:bg-gray-300" href="#intro">{$t('home.discoverBabel')}</a>
			<a class="text-white bg-gray-800 btn w-fit hover:bg-gray-900" href="/sessions">{$t('home.joinSession')}</a>
		</div>
	</section>
	<!-- <div class="form-control">
		<label class="flex flex-col gap-2 cursor-pointer label">
			<span class="text-white label-text">{graphIntro ? 'Graph' : 'Carousel'}</span>
			<input type="checkbox" class="bg-black toggle toggle-success" bind:checked={graphIntro} />
		</label>
	</div> -->
	<div
		class="flex flex-col-reverse items-center w-full gap-0 px-12 lg:h-80 md:px-40 xl:px-64 lg:flex-row-reverse md:justify-center"
	>
		{#if graphIntro}
			<div
				in:scale={{
					delay: 50,
					duration: 400,
					easing: quintOut
				}}
				class="flex flex-col w-full h-full gap-4 text-justify item md:py-12"
			>
				{#key homeStore.selectedNode}
					<div
						in:fade={{
							duration: 400
						}}
						class="flex flex-col w-full"
					>
						<div class="text-xl font-semibold first-letter:capitalize">
							{$t(homeStore.selectedNode?.title ?? 'oupsi')}
						</div>
						<div class="">{$t(homeStore.selectedNode?.text ?? 'oupsi')}</div>
						{#if homeStore.selectedNode?.id === 3}
							<form class="flex justify-between mt-2" onsubmit={submitUserMessage}>
								<input
									type="text"
									bind:value={userMessage}
									placeholder={$t('home.writeMessage')}
									class="max-w-xs input border-primary-500"
								/>
								<button type="submit" class=" btn btn-accent">{$t('home.send')}</button>
							</form>
						{:else if homeStore.selectedNode?.id === 5}
							<div class="mt-2 chat chat-end">
								<div class="rounded-full chat-image avatar ring-primary-500 ring-1">
									<div class="w-10 rounded-full">
										<img alt="Tailwind CSS chat bubble component" src={graph1} />
									</div>
								</div>
								<div class="mr-2 text-black chat-bubble bg-primary-500">
									{$t('home.tryDragGraph')}
								</div>
							</div>
						{/if}
					</div>
				{/key}
			</div>
			<div class="w-full text-left">
				{#key reloadGraph}
					<ExampleGraph />
				{/key}
			</div>
		{:else}
			<div
				class="flex justify-center w-screen"
				in:scale={{
					delay: 50,
					duration: 400,
					easing: quintOut
				}}
			>
				<div
					class="self-center p-4 text-center border w-96 sm:justify-self-center carousel rounded-box bg-gray-950"
				>
					{#each homeStore.nodes as node, i (node.id)}
						<div id="item{i}" class="flex flex-col w-full gap-2 p-4 carousel-item text-wrap">
							<h3 class="text-xl font-bold">{node.title}</h3>
							<div>{node.text}</div>
						</div>
					{/each}
				</div>
			</div>
		{/if}
	</div>
	<Sessions sessions={data.sessions} />
</div>

<style>
	.blinking-underscore {
		animation: blink 1s step-start infinite 2s;
	}

	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
