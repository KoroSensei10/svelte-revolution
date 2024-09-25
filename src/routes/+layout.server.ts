import '$lib/i18n';
import { pb } from '$lib/pocketbase.js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const authCookie = cookies.get('pb-auth');

	if (!authCookie) {
		return {
			user: null
		};
	}
	pb.authStore.loadFromCookie(authCookie);

	try {
		pb.authStore.isValid && (await pb.collection('users').authRefresh());
		return {
			user: pb.authStore.model
		};
	} catch (_) {
		pb.authStore.clear();
		cookies.delete('pb-auth', { path: '/' });
		return {
			user: null
		};
	}
};
