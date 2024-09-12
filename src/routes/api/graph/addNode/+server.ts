import Message from '$lib/models/Message';
import { error, type RequestHandler } from '@sveltejs/kit';

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
		error(500, {
			message: 'No message found',
			status: 500
		});
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
		status: 200,
		headers: {
			'Content-Type': 'application/json'
		}
	});
};
