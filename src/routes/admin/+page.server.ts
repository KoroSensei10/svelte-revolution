import { pb } from '$lib/pocketbase';
import type { User } from '$types/pocketBase/TableTypes';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent }) => {
	const data = (await parent()) as { user: User | null };
	if (!data.user) {
		return redirect(302, '/login');
	}
	const sessions = await pb.collection('Session').getFullList({
		filter: pb.filter('author = {:user}', { user: data.user.id }),
		expand: 'scenario'
	});

	return {
		sessions
	};
};
