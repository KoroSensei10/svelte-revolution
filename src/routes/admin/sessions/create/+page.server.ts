import { pb } from '$lib/pocketbase';
import { createSession, createStartNode, getScenario } from '$lib/server/sessions/create.js';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createSession: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		const scenarioId = data.get('scenarioId');
		const author = data.get('author');

		if (!name || !scenarioId || !author) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await getScenario(scenarioId.toString());
			if (!scenario) {
				return fail(404, { error: 'Scenario not found' });
			}

			const session = await createSession(name, scenario.id, author);
			await createStartNode(scenario, session.id);

			return {
				status: 201,
				success: true,
				session: session
			};
		} catch (error) {
			return fail(500, {
				error: String(error)
			});
		}
	}
} satisfies Actions;

export const load = async ({ parent }) => {
	const scenarios = await pb.collection('scenario').getFullList();
	return {
		...(await parent()),
		scenarios
	};
};
