<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';

	import { fade } from 'svelte/transition';

	import type { ActionData } from './$types';

	export let form: ActionData;

	let loading = false;
</script>

<form
	use:enhance={async () => {
		loading = true;

		await new Promise((resolve) => setTimeout(resolve, 1000));

		return async ({ update }) => {
			await update();
			loading = false;
		};
	}}
	action="?/login"
	method="post"
	class="flex flex-col items-center gap-4 p-4"
>
	<div class="flex flex-col items-center gap-4 p-4 w-fit">
		<label class="flex items-center gap-2 input input-bordered input-accent">
			{$t('username')}
			<input type="text" class="grow" placeholder="Daisy" name="username" />
		</label>
		<label class="flex items-center gap-2 input input-bordered input-accent">
			{$t('password')}
			<input type="password" class="grow" placeholder="••••••••" name="password" />
		</label>
		<div class="flex flex-row items-center self-start justify-between w-full h-12">
			<button type="submit" class="p-4 font-bold w-fit btn btn-accent">{$t('login')}</button>
			{#if loading}
				<div in:fade class="w-10 loading loading-ring"></div>
			{:else}
				<div></div>
			{/if}
		</div>
		{#if form?.success === false}
			<div class="text-center w-fit alert alert-warning">
				{form?.message}
			</div>
		{/if}
	</div>
</form>
