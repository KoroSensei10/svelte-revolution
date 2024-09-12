import Session from '$lib/models/Session';

export async function load() {
	const sessions = await Session.findAll();

	return {
		sessions: sessions.map((session) => session.toJSON())
	};
}
