import Message from '$lib/models/Message';
import type { RequestHandler } from '@sveltejs/kit';

async function getLastMessage(sessionId: string) {
	return await Message.findOne({
		where: {
			sessionId
		},
		order: [['id', 'DESC']]
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const data = JSON.parse(await request.text());

	const lastMessage = await getLastMessage(data.sessionId);

	if (!lastMessage) {
		return new Response('error');
	}

	const lastMessageId = Number(lastMessage.get('id'));

	const node = {
		id: lastMessageId + 1,
		title: data.newNode.title,
		text: data.newNode.text,
		parentId: data.selectNodeId,
		sessionId: data.sessionId
	};

	Message.create(node);

	return new Response(JSON.stringify(node), {
		headers: {
			'content-type': 'application/json'
		}
	});
};
