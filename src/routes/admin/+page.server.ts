import { pb } from '$lib/pocketbase.js';
import type { User } from '$types/tableTypes.js';
import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const data = (await parent()) as { user: User | null };
	if (!data.user) {
		return redirect(302, '/login');
	}
	const sessions = await pb.collection('session').getFullList({
		filter: pb.filter('author = {:user}', { user: data.user.id }),
		expand: 'scenario'
	});

	return {
		sessions
	};
}
