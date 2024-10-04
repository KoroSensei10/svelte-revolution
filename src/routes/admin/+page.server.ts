import { pb } from '$lib/pocketbase';
import type { User } from '$types/pocketBase/TableTypes';
import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	if (!locals.pb.authStore.isValid) {
		return {
			sessions: []
		};
	}
	const user = locals.pb.authStore.model as User;
	const sessions = await pb.collection('Session').getFullList({
		filter: pb.filter('author = {:user}', { user: user.id }),
		expand: 'scenario'
	});

	return {
		sessions
	};
};
