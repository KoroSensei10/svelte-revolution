import { pb } from '$lib/pocketbase';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async () => {
	try {
		const sessions = await pb.collection('Session').getFullList({ expand: 'scenario' });
		return { sessions };
	} catch (error) {
		console.error('Error fetching sessions:', error);
		return { sessions: [] };
	}
};
