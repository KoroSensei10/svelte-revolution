import Message from '$lib/models/Message';
import { sync } from '$lib/sequelize';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
    sync();

    const data = JSON.parse(await request.text());

    const lastMessage = await Message.findOne({
        where: {
            sessionId: data.sessionId
        }, order: [
            ['id', 'DESC']
        ]
    });

    if (!lastMessage) {
        return new Response('error');
    }

    const lastMessageId = lastMessage?.get('id') as number;

    Message.create({
        id: lastMessageId + 1,
        sessionId: data.sessionId,
        title: data.newNode.title,
        text: data.newNode.text,
        parentId: data.selectNodeId
    })

    return new Response('ok');
};
