import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ url, locals }) => {
	if (!locals.pb.authStore.isValid) {
		return redirect(303, '/login');
	}

	return {
		user: locals.pb.authStore.model,
		route: url.pathname
	};
};
