<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from 'svelte-i18n';

	import type { ActionData } from './$types';
	import nProgress from 'nprogress';
	import toast from 'svelte-french-toast';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();

	$effect(() => {
		if (form?.error) {
			toast.error(form.error, { duration: 5000, position: 'bottom-center' });
		}
	});
</script>

<div class="flex flex-col w-full gap-4 py-4 text-center">
	<h1 class="text-4xl font-thin text-center text-white first-letter:capitalize">{$t('login')}</h1>
	<form
		use:enhance={() => {
			nProgress.start();
			return async ({ update }) => {
				await update({ reset: false });
				nProgress.done();
			};
		}}
		action="?/login"
		method="post"
		class="flex flex-col items-center self-center w-full gap-4 p-4 sm:w-1/2"
	>
		<div class="flex flex-col items-start w-full gap-4 p-4 text-black">
			<label class="flex items-center w-full gap-2 input input-bordered input-accent">
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
			<div class="flex flex-row items-center justify-center w-full h-12">
				<button type="submit" class="p-4 font-bold w-fit btn btn-accent">{$t('login')}</button>
			</div>
		</div>
	</form>
</div>
