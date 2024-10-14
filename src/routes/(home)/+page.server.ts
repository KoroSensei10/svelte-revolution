import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	try {
		const sessions = await locals.pb.collection('Session').getFullList({ expand: 'scenario, author' });

		return { sessions };
	} catch (error) {
		console.error('Error fetching sessions:', error);
		return { sessions: [] };
	}
};
