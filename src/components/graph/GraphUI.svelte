<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import type { End, GraphEvent, Session, Side, User } from '$types/pocketBase/TableTypes';
	import { selectedNodeStore } from '$stores/graph';
	import { enhance } from '$app/forms';
	import nProgress from 'nprogress';
	import toast from 'svelte-french-toast';
	import type { ActionResult } from '@sveltejs/kit';

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

	let nodeTitle = $state('');
	let nodeText = $state('');
	let nodeAuthor = $state('');

	let theForm: HTMLFormElement | undefined = $state();
	let validForm = $state(false);

	let addNodeChecked = $state(false);

	function handleAddNodeActionResult(result: ActionResult) {
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
		nodeInfoChecked = !!value;
	});

	onMount(() => {
		nodeAuthor = localStorage.getItem('author') || '';
	});

	onDestroy(() => {
		selectedNodeUnsubscribe();
	});
</script>

<div
	class="fixed z-50 flex flex-col w-full bg-black border-t max-sm:bottom-0 bg-opacity-90 sm:top-0 sm:right-0 sm:border-t-0 sm:border-b sm:border-l sm:w-1/3 lg:w-1/4"
>
	{#if !session?.completed}
		<!-- ADD NODE -->
		<form
			class="w-full rounded-none collapse collapse-plus sm:collapse-arrow"
			bind:this={theForm}
			method="post"
			action="/sessions/{session.id}?/addNode"
			onsubmit={(e) => {
				e.preventDefault();
			}}
			use:enhance={() => {
				nProgress.start();
				return async ({ update, result }) => {
					await update({ reset: false });
					handleAddNodeActionResult(result);
				};
			}}
			oninput={() => (validForm = !!theForm?.checkValidity())}
		>
			<input type="checkbox" class="" name="GraphUI" bind:checked={addNodeChecked} />
			<div class="w-full font-semibold collapse-title">
				{$t('writeMessage')}
			</div>
			<div class="z-50 flex flex-col py-0 overflow-auto collapse-content snoup">
				<div class="w-full">
					<div class="w-full">
						<input
							required
							autocomplete="off"
							bind:value={nodeTitle}
							name="title"
							placeholder={$t('yourTitle')}
							class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
						/>
					</div>
				</div>
				<div class="w-full">
					<textarea
						required
						autocomplete="off"
						bind:value={nodeText}
						name="text"
						placeholder={$t('yourMessage')}
						class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					></textarea>
				</div>
				<div class="w-full">
					<input
						required
						autocomplete="username"
						bind:value={nodeAuthor}
						name="author"
						placeholder={$t('yourName')}
						class="w-full py-4 placeholder:font-thin placeholder:italic focus:border-white"
					/>
				</div>
				<div>
					<select name="side" class="w-full p-4 border rounded">
						<option disabled selected>{$t('side.chooseSide')}</option>
						{#each sides as side}
							<option value={side.id}>{side.name}</option>
						{/each}
					</select>
				</div>
				<div class="w-full py-4 text-center">
					<button
						type="submit"
						disabled={!validForm}
						class="font-light border-none btn disabled:cursor-not-allowed disabled:bg-white disabled:opacity-50 hover:bg-white bg-primary-500"
					>
						{$t('publish')}
					</button>
				</div>
				<input type="hidden" name="session" value={session.id} />
				<input type="hidden" name="parent" value={$selectedNodeStore?.id} />
			</div>
		</form>
	{:else}
		<div class="w-full collapse collapse-plus sm:collapse-arrow">
			<input type="checkbox" name="GraphUI" />
			<div class="font-semibold collapse-title">
				{$t('sessions.sessionEnded')}
			</div>
			<div class="collapse-content">
				<div class="text-xl font-semibold first-letter:capitalize">
					{session.expand?.end?.title}
				</div>
				<div>
					{session.expand?.end?.text}
				</div>
			</div>
		</div>
	{/if}
	<!-- NODE INFOS -->
	<div class="border-t rounded-none collapse collapse-plus sm:collapse-arrow">
		<input bind:checked={nodeInfoChecked} class="" name="GraphUI" type="checkbox" />
		<div class="font-bold collapse-title">
			{$t('nodeInformation')}
		</div>
		<div class="text-white collapse-content">
			{#if $selectedNodeStore}
				<div class="text-xl font-semibold first-letter:capitalize">{$selectedNodeStore.title}</div>
				<div class="text-lg">{$t('side.side')}: {$selectedNodeStore.expand?.side?.name ?? $t('neutral')}</div>
				<div>{$t('from')} {$selectedNodeStore.author}</div>
				<div class="pl-1 overflow-auto max-h-44">{$selectedNodeStore.text}</div>
			{:else}
				<div class="pb-0 text-xl text-center first-letter:capitalize">{$t('noNodeSelected')}</div>
			{/if}
		</div>
	</div>
	<!-- ADMIN -->
	{#if admin && user && !session?.completed}
		<div class="border-t rounded-none collapse collapse-plus sm:collapse-arrow">
			<input type="checkbox" class="" name="GraphUI" />
			<div class="font-bold collapse-title">
				{$t('admin')}
			</div>
			<div class="flex flex-col gap-4 text-white collapse-content">
				{@render formTemplate(events, 'addEvent', 'eventId', $t('sessions.addEvent'), true)}
				{@render formTemplate(ends, 'endSession', 'endId', $t('sessions.endSession'))}
			</div>
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
				handleAddNodeActionResult(result);
			};
		}}
		class="flex flex-col gap-4 p-x-4"
	>
		<select {name} id={name} class="w-full border rounded">
			<option disabled selected>{trad}</option>
			{#each values as value}
				{@const alreadySelected =
					needDisabled && session.expand.events?.filter((event) => event.id === value.id).length > 0}
				<option disabled={alreadySelected} value={value.id}>{value.title}</option>
			{/each}
		</select>
		<input type="hidden" name="session" value={session.id} />

		<button type="submit" class="self-center p-4 text-white rounded w-fit bg-primary-500">
			{trad}
		</button>
	</form>
{/snippet}

<style lang="postcss">
	.snoup {
		@apply py-0;
	}
</style>
