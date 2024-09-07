import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', async (socket) => {
			// // We get url of the connection request
			// const url = socket.handshake.headers.referer;
			// // We use a regex to get the '/session/x' (with x a number) in the url, if any
			// const sessionId = url?.match(/\/sessions\/\d+/);
			// // If the regex is found, the user join the session room
			// if (sessionId && sessionId.length === 1) {
			// 	await socket.join(sessionId[0]);
			// }
			socket.emit('eventFromServer', 'Hello, World 👋');
			console.log('New node connection');
			io.on('message', () => {
				console.log('New node event from client');
				io.emit('eventFromServer', 'Yes 👍');
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
