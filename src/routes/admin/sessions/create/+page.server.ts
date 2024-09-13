import Node from '$lib/models/Node';
import Scenario from '$lib/models/Scenario';
import Session from '$lib/models/Session';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createSession: async ({ request }) => {
		const data = await request.formData();

		const name = data.get('name');
		const scenarioId = data.get('scenarioId');

		if (!name || !scenarioId) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await Scenario.findByPk(scenarioId.toString());
			if (!scenario) {
				return fail(404, { error: 'Scenario not found' });
			}
			const session = await Session.create({ name, scenarioId });

			const scenarioData = await scenario.toJSON();

			const firstMessage = {
				id: 1,
				sessionId: session.get('id'),
				text: scenarioData.prologue,
				title: scenarioData.title,
				parentId: 0
			};

			await Node.create(firstMessage);
			return {
				success: true,
				status: 201,
				session: await session.toJSON()
			};
		} catch (error) {
			return fail(500, { error: 'error' });
		}
	}
} satisfies Actions;

export const load = async () => {
	const scenarios = await Scenario.findAll();
	return {
		scenarios: scenarios.map((scenario) => scenario.toJSON())
	};
};
