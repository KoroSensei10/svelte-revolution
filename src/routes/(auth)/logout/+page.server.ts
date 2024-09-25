import { type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ cookies, locals }) => {
		locals.pb.authStore.clear();
		cookies.delete('pb_auth', { path: '/' });
	}
};
