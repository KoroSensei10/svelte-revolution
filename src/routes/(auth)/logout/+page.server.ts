import { redirect, type Actions } from '@sveltejs/kit';

export const actions: Actions = {
	logout: async ({ cookies, locals, request }) => {
		locals.pb.authStore.clear();
		cookies.delete('pb_auth', { path: '/' });

		if (request.headers.get('referer')?.includes('admin')) {
			return redirect(302, '/login');
		}

		return redirect(302, request.headers.get('referer') || '/');
	}
};
