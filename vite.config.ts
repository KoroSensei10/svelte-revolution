import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type ViteDevServer } from 'vite';

import { Server } from 'socket.io';

const webSocketServer = {
	name: 'webSocketServer',
	configureServer(server: ViteDevServer) {
		if (!server.httpServer) return;

		const io = new Server(server.httpServer);

		io.on('connection', async (socket) => {
			// We get url of the connection request
			const url = socket.handshake.headers.referer;

			// We use a regex to get the '/session/x' (with x a number) in the url, if any
			const sessionId = url?.match(/\/sessions\/\d+/);
			// If the regex is found, the user join the session room
			if (sessionId && sessionId.length === 1) {
				socket.join(sessionId[0]);
			}
			socket.emit('message', 'Logged in as ');
			socket.on('newNodeClient', (data) => {
				socket.emit('newNodeServer', data);
			});
		});
	}
};

export default defineConfig({
	plugins: [sveltekit(), webSocketServer]
});
