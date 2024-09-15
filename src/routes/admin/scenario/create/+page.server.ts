import { fail, type Actions } from '@sveltejs/kit';

import { pb } from '$lib/pocketbase';

export const actions = {
	// TODO - Add validation + split code
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

		if (!title || !prologue || !lang || !firstNodeTitle || !firstNodeText || !firstNodeAuthor) {
			return fail(400, { error: 'Missing required fields' });
		}

		try {
			const scenario = await pb.collection('scenario').create({
				title,
				prologue,
				lang,
				firstNodeTitle,
				firstNodeText,
				firstNodeAuthor
			});

			const eventPromises = events.map((event, i) =>
				pb.collection('event').create({
					title: event,
					text: eventTexts[i],
					author: eventAuthors[i],
					scenario: scenario.id
				}));

			const endPromises = ends.map((end, i) =>
				pb.collection('end').create({
					title: end,
					text: endTexts[i],
					scenario: scenario.id
				}));

			await Promise.all([
				...eventPromises,
				...endPromises
			]);
			return {
				success: true,
				status: 201,
				body: scenario
			};
		} catch (error) {
			console.log(error);

			return fail(500, { error: String(error) });
		}
	}
} satisfies Actions;

export function load() {
	return {
		lang: ["en", "fr", 'jp']
	};
}
