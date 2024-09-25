import { fail, type Actions } from '@sveltejs/kit';
import { createEventsAndEnds, createScenario } from '$lib/server/scenario/create';

export const actions = {
	createScenario: async ({ request }) => {
		const data = await request.formData();

		const title = data.get('title');
		const prologue = data.get('prologue');
		const lang = data.get('lang');
		const firstNodeTitle = data.get('firstNodeTitle');
		const firstNodeText = data.get('firstNodeText');
		const firstNodeAuthor = data.get('firstNodeAuthor');
		const events = data.getAll('event');
		const eventTexts = data.getAll('event-text');
		const eventAuthors = data.getAll('event-author');
		const ends = data.getAll('end');
		const endTexts = data.getAll('end-text');

		if (!title || !prologue || !lang || !firstNodeTitle || !firstNodeText || !firstNodeAuthor || !events.length || !ends.length) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await createScenario({
				title,
				prologue,
				lang,
				firstNodeTitle,
				firstNodeText,
				firstNodeAuthor
			});

			await createEventsAndEnds(scenario.id, events, eventTexts, eventAuthors, ends, endTexts);

			return {
				success: true,
				status: 201,
				body: scenario
			};
		} catch (error) {
			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export function load() {
	return {
		lang: ['en', 'fr', 'jp']
	};
}
