<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
</script>

<div class="flex flex-col gap-4 py-4">
	<h1 class="text-4xl font-thin text-center text-white first-letter:capitalize">{$t('login')}</h1>
	<form
		use:enhance={async () => {
			loading = true;
			return async ({ update }) => {
				await update({ reset: false });
				loading = false;
			};
		}}
		action="?/login"
		method="post"
		class="flex flex-col items-center gap-4 p-4"
	>
		<div class="flex flex-col items-start gap-4 p-4 text-black w-fit">
			<label class="flex items-center gap-2 input input-bordered input-accent">
				{$t('username')}
				<input type="text" class="grow" placeholder="Daisy" autocomplete="username" name="username" />
			</label>
			<label class="flex items-center w-full gap-2 input input-bordered input-accent">
				{$t('password')}
				<input
					type="password"
					class="grow"
					placeholder="••••••••"
					autocomplete="current-password"
					name="password"
				/>
			</label>
			<div class="flex flex-row items-center self-start justify-between w-full h-12">
				<button type="submit" class="p-4 font-bold w-fit btn btn-accent">{$t('login')}</button>
				{#if loading}
					<div class="w-10 text-white loading loading-ring"></div>
				{:else}
					<div></div>
				{/if}
			</div>
			{#if form?.error}
				<div class="text-center w-fit alert alert-warning">
					{form?.error}
				</div>
			{/if}
		</div>
	</form>
</div>
