import type { MyPocketBase } from '$types/pocketBase';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createUser: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const pb = locals.pb as MyPocketBase;
			if (!pb || !pb.authStore) {
				return fail(500, { err: 'Database not connected' });
			} else if (!pb.authStore.isValid || !pb.authStore.model) {
				return fail(401, { err: 'Unauthorized' });
			}
			const user = await locals.pb.collection('Users').create({
				username,
				password,
				passwordConfirm: password,
				name: username
			});
			return {
				status: 201,
				success: true,
				user
			};
		} catch (err) {
			return fail(400, { err: JSON.stringify(err) });
		}
	}
} satisfies Actions;
