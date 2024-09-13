import End from '$lib/models/End';
import Event from '$lib/models/Event';
import Scenario from '$lib/models/Scenario';
import { fail, type Actions } from '@sveltejs/kit';

export const actions = {
	createScenario: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title');
		const prologue = data.get('prologue');
		const lang = data.get('lang');
		const firstNodeTitle = data.get('firstNodeTitle');
		const firstNodeText = data.get('firstNodeText');
		const events = data.getAll('event');
		const eventTexts = data.getAll('event-text');
		const ends = data.getAll('end');
		const endTexts = data.getAll('end-text');

		if (!title || !prologue) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await Scenario.create(
				{
					title,
					prologue,
					lang,
					// node: {
					// 	title: firstNodeTitle,
					// 	text: firstNodeText
					// },
					Events: events.map((event, i) => ({
						title: event,
						text: eventTexts[i],
						author: 'admin'
					})),
					Ends: ends.map((end, i) => ({
						title: end,
						text: endTexts[i]
					}))
				},
				{ include: [Event, End] }
			);
			return {
				success: true,
				status: 201,
				body: await scenario.toJSON()
			};
		} catch (error) {
			console.log(error);

			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export function load() {
	return {
		lang: Scenario.getAttributes().lang.values ?? []
	};
}
