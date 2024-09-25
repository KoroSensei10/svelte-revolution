import PocketBase, { RecordService } from 'pocketbase';
import { writable, type Writable } from 'svelte/store';
import type { End, NodeType, Scenario, Session, Side, User } from '$types/tableTypes';

interface MyPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'Node'): RecordService<NodeType>;
	collection(idOrName: 'Scenario'): RecordService<Scenario>;
	collection(idOrName: 'End'): RecordService<End>;
	collection(idOrName: 'Event'): RecordService<Event>;
	collection(idOrName: 'Session'): RecordService<Session>;
	collection(idOrName: 'Side'): RecordService<Side>;
	collection(idOrName: 'User'): RecordService<User>;
}

export const pb = new PocketBase('https://db.canard.cc') as MyPocketBase;

export const currentUser: Writable<User | null> = writable(pb.authStore.model as User | null);

pb.authStore.onChange(() => {
	currentUser.set(pb.authStore.model as User | null);
});
