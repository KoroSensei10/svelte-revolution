import { buildNodesAndLinks, getSession } from '$lib/server/sessions';

export async function load({ params, parent }) {
	const sessionData = await getSession(Number(params.slug));

	const nodesAndLinks = await buildNodesAndLinks(sessionData);

	return {
		...(await parent()),
		sessionData,
		nodesAndLinks
	};
}
