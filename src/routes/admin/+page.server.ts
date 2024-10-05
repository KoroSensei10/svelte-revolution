import type { User } from '$types/pocketBase/TableTypes';
import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	if (!pb.authStore.isValid) {
		return {
			sessions: []
		};
	}
	const user = pb.authStore.model as User;
	const sessions = await pb.collection('Session').getFullList({
		filter: pb.filter('author = {:user}', { user: user.id }),
		expand: 'scenario'
	});

	return {
		sessions
	};
};
