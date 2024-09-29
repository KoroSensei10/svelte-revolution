<svelte:options runes={true} />

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { t } from 'svelte-i18n';
	import type { Session, User } from '$types/tableTypes';
	import { selectedNodeStore } from '$stores/graph';
	import { enhance } from '$app/forms';
	import nProgress from 'nprogress';
	import toast from 'svelte-french-toast';
	import type { ActionResult } from '@sveltejs/kit';

	interface Props {
		user?: User | null;
		session: Session;
		admin?: boolean;
	}
	let { user = null, session, admin }: Props = $props();

	let nodeInfoChecked = $state(false);

	let nodeTitle = $state('');
	let nodeText = $state('');
	let nodeAuthor = $state('');

	let theForm: HTMLFormElement | undefined = $state();
	let validForm = $state(false);

	let addNodeChecked = $state(false);

	function handleAddNodeActionResult(result: ActionResult) {
		nProgress.done();
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
				break;
			default:
				break;
		}
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
	class="fixed bottom-0 z-50 w-full bg-black border-t bg-opacity-90 scrollbar-thin scrollbar-thumb-white scrollbar-track-black sm:top-0 sm:bottom-auto sm:right-0 sm:border-t-0 sm:border-b sm:border-l sm:w-1/3 lg:w-1/4"
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
			<div class="z-50 flex flex-col py-0 collapse-content snoup">
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
						name={'author'}
						placeholder={$t('yourName')}
						class="w-full py-4 border-b placeholder:font-thin placeholder:italic focus:border-white"
					/>
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
			<input type="checkbox" class="" name="GraphUI" />
			<div class="font-semibold collapse-title">
				{$t('sessions.sessionEnded')}
			</div>
			<div class="collapse-content">snoup</div>
		</div>
	{/if}
	<!-- NODE INFOS -->
	<div class="sticky bottom-0 border-t rounded-none collapse collapse-plus sm:collapse-arrow">
		<input type="checkbox" class="" name="GraphUI" bind:checked={nodeInfoChecked} />
		<div class="font-bold collapse-title">
			{$t('nodeInformation')}
		</div>
		<div class="text-white collapse-content">
			{#if $selectedNodeStore}
				<div class="p-4 text-xl font-semibold first-letter:capitalize">{$selectedNodeStore.title}</div>
				<div>{$t('from')} {$selectedNodeStore.author}</div>
				<div class="pt-2">{$selectedNodeStore.text}</div>
			{:else}
				<div class="p-4 pb-0 text-xl text-center first-letter:capitalize">{$t('noNodeSelected')}</div>
			{/if}
		</div>
	</div>
	<!-- ADMIN -->
	{#if admin && user && !session?.completed}
		<div class="sticky bottom-0 w-full border-t rounded-none collapse collapse-plus sm:collapse-arrow">
			<input type="checkbox" class="" name="GraphUI" />
			<div class="font-bold collapse-title">
				{$t('admin')}
			</div>
			<div class="text-white collapse-content">
				<div>
					<button>{$t('sessions.endSession')}</button>
					<!-- TODO ADD EVENT -->
					<button>{$t('addEvent')}</button>
				</div>
			</div>
		</div>
	{/if}
</div>

<style lang="postcss">
	.snoup {
		@apply py-0;
	}
</style>
