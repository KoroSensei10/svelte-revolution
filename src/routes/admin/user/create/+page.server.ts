import { fail, type Actions } from '@sveltejs/kit';
import type { MyPocketBase } from '$types/pocketBase';
import type { User } from '$types/pocketBase/TableTypes';
import type { ClientResponseError } from 'pocketbase';

export const actions = {
	createUser: async ({ request, locals }) => {
		const pb = locals.pb as MyPocketBase;
		const model = pb.authStore.model as User;
		if (!pb || !pb.authStore) {
			return fail(500, { err: 'Database not connected' });
		} else if (!pb.authStore.isValid || model.role !== 'superAdmin') {
			return fail(401, { err: 'Unauthorized' });
		}

		const data = await request.formData();
		const username = data.get('username') as string;
		const password = data.get('password') as string;

		if (!username || !password) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const user = await locals.pb.collection('Users').create({
				username,
				password,
				passwordConfirm: password,
				name: username,
				role: 'admin'
			});
			return {
				status: 201,
				success: true,
				user
			};
		} catch (err) {
			const error = err as ClientResponseError;
			console.log(err);

			return fail(400, { error: error.message });
		}
	}
} satisfies Actions;
