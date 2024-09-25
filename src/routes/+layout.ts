import '$lib/i18n';
import { waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';
import { pb } from '$lib/pocketbase';

export const load: LayoutLoad = async () => {
	await waitLocale();
	pb.authStore.loadFromCookie('set-cookie', 'pb-auth');
	try {
		pb.authStore.isValid && (await pb.collection('users').authRefresh());
	} catch (_) {
		pb.authStore.clear();
	}
};
