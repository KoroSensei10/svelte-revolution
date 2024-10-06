import { type Actions, fail, redirect } from '@sveltejs/kit';
import type { ClientResponseError } from 'pocketbase';

export const actions: Actions = {
	login: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch (err) {
			const error = err as ClientResponseError;
			return fail(400, { error: error.message });
		}
		return redirect(303, '/admin');
	},
	loginWithProvider: async ({ request, locals }) => {
		/* @see ./+page.svelte#loginWithDiscord */
		const data = await request.formData();
		const cookie = data.get('cookie') as string;
		try {
			locals.pb.authStore.loadFromCookie(cookie);
		} catch (err) {
			const error = err as ClientResponseError;
			return fail(400, { error: error.message });
		}
		return redirect(303, '/admin');
	}
};
