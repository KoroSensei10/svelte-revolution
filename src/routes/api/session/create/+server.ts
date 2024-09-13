import { error } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import Scenario from "$lib/models/Scenario";
import Session from "$lib/models/Session";
import Node from "$lib/models/Node";

export const POST: RequestHandler = async ({ request }) => {
    const { scenarioId, name } = await request.json();

    if (!name || !scenarioId) {
        return error(400, { status: 400, message: 'Missing required fields' });
    }

    try {
        const scenario = await Scenario.findByPk(scenarioId.toString());
        if (!scenario) {
            return error(404, { status: 404, message: 'Scenario not found' });
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
        return new Response(JSON.stringify({
            success: true,
            status: 201,
            session: await session.toJSON()
        }))
    } catch (e) {
        return error(500, { status: 500, message: String(e) })
    }
}