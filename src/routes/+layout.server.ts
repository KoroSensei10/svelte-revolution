import '$lib/i18n';
import type { User } from '$types/tableTypes';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
	if (!locals.pb.authStore.isValid) {
		return {
			user: null
		};
	}
	try {
		await locals.pb.collection('users').authRefresh();
		return {
			user: locals.pb.authStore.model as User
		};
	} catch (_) {
		console.warn(_);
		locals.pb.authStore.clear();
		cookies.delete('pb_auth', { path: '/' });
		return {
			user: null
		};
	}
};
