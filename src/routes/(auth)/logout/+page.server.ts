import { pb } from '$lib/pocketbase';
import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ cookies }) => {
		pb.authStore.clear();
		cookies.delete('pb-auth', { path: '/' });
	}
};
