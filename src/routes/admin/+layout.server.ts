import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import { pb } from '$lib/pocketbase';
import type { User } from '$types/tableTypes';

export const load: LayoutServerLoad = async ({ parent }) => {
	const data = (await parent()) as { user: User | null };

	if (!data.user) {
		return redirect(302, '/login');
	}

	const sessions = await pb.collection('session').getFullList({
		filter: pb.filter('author = {:user}', { user: data.user.id }),
	})

	return {
		sessions
	}
};
