import Message from '$lib/models/Message';
import Session from '$lib/models/Session';
import { sync } from '$lib/sequelize';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const data = JSON.parse(await request.text());
	sync();
	console.log(data);

	// const session = await Session.create({
	// 	name: data.newNode.name
	// });

	try {
		await Message.create({
			id: 543,
			title: data.newNode.name,
			sessionId: 1
		});
	} catch (e) {
		// snoup
	}

	Message.findAndCountAll({
		where: {
			sessionId: 1
		}
	}).then((result) => {
		console.log(result.count);
	});

	return new Response('ok');
};
