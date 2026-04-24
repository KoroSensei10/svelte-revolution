import { pb } from '$lib/client/pocketbase';
import { error } from '@sveltejs/kit';
import { getSession } from '$lib/sessions';

import type { AiLog } from '$types/pocketBase/TableTypes';

export const load = async ({ params }) => {
	// Auth check
	if (!pb.authStore.isValid || !pb.authStore.record) {
		error(401, { status: 401, message: 'Unauthorized' });
	}
	const role = pb.authStore.record.role;
	if (role !== 'admin' && role !== 'superAdmin') {
		error(403, { status: 403, message: 'Forbidden' });
	}

	const session = await getSession(Number(params.slug));
	const scenario = session.expand?.scenario;
	if (!scenario) {
		error(500, { status: 500, message: 'No scenario for session' });
	}

	const [nodes, aiLogs, sides] = await Promise.all([
		pb.collection('Node').getFullList({
			filter: pb.filter('session = {:session}', { session: session.id }),
			sort: 'created',
			expand: 'side',
		}),
		pb.collection('AiLog').getFullList({
			filter: pb.filter('session = {:session}', { session: session.id }),
			sort: 'created',
		}) as Promise<AiLog[]>,
		pb.collection('Side').getFullList({
			filter: pb.filter('scenario = {:scenario}', { scenario: session.scenario }),
		}),
	]);

	return {
		session,
		scenario,
		nodes,
		aiLogs,
		sides,
	};
};
