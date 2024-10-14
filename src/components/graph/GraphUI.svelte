<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import type { End, GraphEvent, Session, Side, User } from '$types/pocketBase/TableTypes';
	import { selectedNodeStore } from '$stores/graph';
	import { enhance } from '$app/forms';
	import nProgress from 'nprogress';
	import toast from 'svelte-french-toast';
	import type { ActionResult } from '@sveltejs/kit';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	import { viewportStore } from '$stores/ui/index.svelte';

	interface Props {
		session: Session;
		user?: User | null;
		admin?: boolean;
		events?: GraphEvent[];
		ends?: End[];
		sides?: Side[];
	}

	let { user = null, session, admin = false, events = [], ends = [], sides = [] }: Props = $props();

	let nodeInfoChecked = $state(false);
	let addNodeChecked = $state(false);
	let sessionEndChecked = $state(false);
	let adminChecked = $state(false);

	let nodeTitle = $state('');
	let nodeText = $state('');
	let nodeAuthor = $state('');

	let theForm: HTMLFormElement | undefined = $state();
	let validForm = $state(false);

	const states = {
		nodeInfo: false,
		addNode: false,
		sessionEnd: false,
		admin: false
	};
	function setCheck(type: 'addNode' | 'nodeInfo' | 'sessionEnd' | 'admin') {
		if (viewportStore.actualBreakpoint != 'lg') {
			for (const key in states) {
				if (key !== type) {
					states[key as 'nodeInfo' | 'addNode' | 'sessionEnd' | 'admin'] = false;
				}
			}
		}

		if (type in states) {
			states[type] = !states[type];
		}

		nodeInfoChecked = states.nodeInfo;
		addNodeChecked = states.addNode;
		sessionEndChecked = states.sessionEnd;
		adminChecked = states.admin;
	}

	function handleActionResult(result: ActionResult) {
		switch (result.type) {
			case 'failure':
				toast.error(result.data?.error, { duration: 3000, position: 'bottom-center' });
				break;
			case 'success':
				toast.success(result.data?.body.message, { duration: 3000, position: 'top-center' });
				addNodeChecked = false;
				nodeTitle = '';
				nodeText = '';
				localStorage.setItem('author', nodeAuthor);

				if (result.data?.body?.event) {
					session.expand.events.push(result.data.body.event);
				}
				break;
			default:
				break;
		}
		nProgress.done();
	}

	const selectedNodeUnsubscribe = selectedNodeStore.subscribe((value) => {
		if (nodeInfoChecked) return;
		setCheck('nodeInfo');
	});

	onMount(() => {
		nodeAuthor = localStorage.getItem('author') || '';
	});

	onDestroy(() => {
		selectedNodeUnsubscribe();
	});
</script>

<div class="z-50 bg-gray-950 border-t border-gray-500 divide-x divide-gray-500 btm-nav dark:bg-gray-950">
	<!-- Add Node Or Session Ended -->
	{#if !session?.completed}
		<div class="flex flex-col-reverse">
			<button
				type="button"
				class="z-20 flex flex-col items-center justify-center w-full h-full bg-gray-950"
				onclick={() => {
					setCheck('addNode');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
				</svg>
				<span class="btm-nav-label">{$t('addNode')}</span>
				<!-- Menu for Add Node -->
			</button>
			{#if addNodeChecked}
				<form
					transition:slide={{
						duration: 200,
						easing: quintOut
					}}
					method="post"
					action="/sessions/{session.id}?/addNode"
					class="flex flex-col items-center gap-2 cursor-default p-2 text-primary-500 absolute z-10 w-screen left-0 md:w-full bg-gray-950 border-t opacity-90 bottom-full"
					onsubmit={(e) => {
						e.preventDefault();
					}}
					use:enhance={() => {
						nProgress.start();
						return async ({ update, result }) => {
							await update({ reset: false });
							handleActionResult(result);
							nProgress.done();
						};
					}}
				>
					<label class="form-control w-full max-w-xs">
						<div class="label p-0">
							<span class="label-text text-inherit">Titre du message</span>
						</div>
						<input
							type="text"
							bind:value={nodeTitle}
							placeholder="Youhouhou"
							class="input input-sm input-accent bg-gray-950 input-bordered w-full max-w-xs"
						/>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label p-0">
							<span class="label-text text-inherit">Ton nom</span>
						</div>
						<input
							type="text"
							bind:value={nodeAuthor}
							placeholder="Snoup"
							class="input input-sm input-accent bg-gray-950 input-bordered w-full max-w-xs"
						/>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label p-0">
							<span class="label-text text-inherit">Ton camp</span>
						</div>
						<select class="select select-accent bg-gray-950 select-sm select-bordered">
							<option disabled selected>Pick one</option>
							<option>Star Wars</option>
						</select>
					</label>
					<label class="form-control w-full max-w-xs">
						<div class="label p-0">
							<span class="label-text text-inherit">Ton message</span>
						</div>
						<textarea
							bind:value={nodeText}
							class="textarea textarea-accent bg-gray-950"
							placeholder="Ton message"
						></textarea>
					</label>
					<button class="btn w-fit btn-accent btn-sm self-center" type="submit">Envoyer</button>
				</form>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col-reverse">
			<!-- Session End -->
			<button
				type="button"
				class="z-20 flex flex-col items-center justify-center w-full h-full bg-gray-950"
				onclick={() => {
					setCheck('sessionEnd');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M5 12l5-5m0 0l5 5m-5-5v12"
					/>
				</svg>
				<span class="btm-nav-label">{$t('sessions.sessionEnded')}</span>
			</button>
			{#if sessionEndChecked}
				<div
					transition:slide={{
						duration: 200,
						easing: quintOut
					}}
					class="flex flex-col items-center gap-2 p-2 text-primary-500 absolute z-10 left-0 w-screen md:w-full bg-gray-950 border-t opacity-90 bottom-full cursor-default"
				>
					<div class="text-xl font-semibold first-letter:capitalize">
						{session.expand?.end?.title}
					</div>
					<div>
						{session.expand?.end?.text}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	<!-- Node Info button -->
	<div class="flex flex-row-reverse">
		<button
			type="button"
			class="z-20 flex flex-col items-center justify-center w-full h-full bg-gray-950"
			onclick={() => {
				setCheck('nodeInfo');
			}}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="w-5 h-5"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M11 17h2v2h-2v-2zm0-8h2v6h-2V9zm0 0V7h2v2h-2z"
				/>
			</svg>
			<span class="btm-nav-label">{$t('nodeInformation')}</span>
		</button>
		{#if nodeInfoChecked}
			<div
				transition:slide={{
					duration: 200,
					easing: quintOut
				}}
				class="flex flex-col items-center gap-2 p-2 text-primary-500 absolute z-10 w-screen md:w-full bg-gray-950 border-t opacity-90 bottom-full {admin
					? ''
					: 'right-0'}"
			>
				{#if $selectedNodeStore}
					<div class="text-xl font-semibold first-letter:capitalize">
						{$selectedNodeStore.title}
					</div>
					<div>
						{$selectedNodeStore.text}
					</div>
				{:else}
					<div class="text-xl font-semibold first-letter:capitalize">
						{$t('noNodeSelected')}
					</div>
				{/if}
			</div>
		{/if}
	</div>

	<!-- Admin button (visible only for admins) -->
	{#if admin && user && !session?.completed}
		<div class="flex flex-col-reverse">
			<button
				type="button"
				class="z-20 flex flex-col items-center justify-center w-full h-full bg-gray-950"
				onclick={() => {
					setCheck('admin');
				}}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="w-5 h-5"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v8m4-4H8" />
				</svg>
				<span class="btm-nav-label">{$t('admin')}</span>
			</button>
			{#if adminChecked}
				<div
					transition:slide={{
						duration: 200,
						easing: quintOut
					}}
					class="flex flex-col items-center gap-2 p-2 text-primary-500 absolute z-10 w-screen right-0 md:w-full bg-gray-950 border-t opacity-90 bottom-full cursor-default"
				>
					{@render formTemplate(ends, 'end', 'end', $t('sessions.endSession'))}
					{@render formTemplate(events, 'event', 'event', $t('sessions.addEvent'), true)}
				</div>
			{/if}
		</div>
	{/if}
</div>

{#snippet formTemplate(
	values: { id: string; title: string }[],
	action: string,
	name: string,
	trad: string,
	needDisabled: boolean = false
)}
	<form
		method="post"
		action="/sessions/{session.id}?/{action}"
		onsubmit={(e) => e.preventDefault()}
		use:enhance={() => {
			nProgress.start();
			return async ({ update, result }) => {
				await update();
				handleActionResult(result);
			};
		}}
		class="flex flex-col gap-4 p-x-4 cursor-default"
	>
		<select {name} id={name} class=" select select-accent select-sm bg-gray-950">
			<option disabled selected>{trad}</option>
			{#each values as value}
				{@const alreadySelected =
					needDisabled && session.expand.events?.filter((event) => event.id === value.id).length > 0}
				<option disabled={alreadySelected} value={value.id}>{value.title}</option>
			{/each}
		</select>
		<input type="hidden" name="session" value={session.id} />
		<button type="submit" class="self-center btn btn-sm btn-accent">
			{trad}
		</button>
	</form>
{/snippet}
