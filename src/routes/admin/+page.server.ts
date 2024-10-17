import type { Session } from '$types/pocketBase/TableTypes';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const user = pb.authStore.model;
	if (!user) {
		pb.authStore.clear();
		redirect(303, '/login');
	}
	const sessions = await pb.collection('Session').getFullList({
		filter: pb.filter('author = {:user}', { user: user.id }),
		expand: 'scenario'
	});
	let otherSessions: Session[] = [];
	if (user.role === 'superAdmin') {
		otherSessions = await pb.collection('Session').getFullList({
			filter: pb.filter('author != {:user}', { user: user.id }),
			expand: 'scenario, author'
		});
	}

	return {
		sessions,
		otherSessions
	};
};
