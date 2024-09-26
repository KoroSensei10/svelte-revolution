import { createSession, createStartNode, getScenario } from '$lib/server/sessions/create';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createSession: async ({ request, locals }) => {
		const data = await request.formData();

		const name = data.get('name');
		const scenarioId = data.get('scenarioId');
		const author = data.get('author');

		if (!name || !scenarioId || !author) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const pb = locals.pb;
			const scenario = await getScenario(pb, scenarioId.toString());
			if (!scenario) {
				return fail(404, { error: 'Scenario not found' });
			}

			const session = await createSession(pb, name, scenario.id, author);
			await createStartNode(pb, scenario, session.id);

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

export const load = async ({ parent, locals }) => {
	const scenarios = await locals.pb.collection('scenario').getFullList();
	return {
		...(await parent()),
		scenarios
	};
};
