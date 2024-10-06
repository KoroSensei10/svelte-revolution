import type { Session, User } from '$types/pocketBase/TableTypes';
import { type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const user = pb.authStore.model as User;
	const sessions = await pb.collection('Session').getFullList({
		filter: pb.filter('author = {:user}', { user: user.id }),
		expand: 'scenario'
	});
	let otherSessions: Session[] = [];
	if (user.role === 'superAdmin') {
		otherSessions = await pb.collection('Session').getFullList({
			filter: pb.filter('author != {:user}', { user: user.id }),
			expand: 'scenario'
		});
	}

	return {
		sessions,
		otherSessions
	};
};
