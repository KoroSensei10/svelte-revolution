import type { End, NodeType, Scenario, Session, Side, User } from '$types/tableTypes';
import PocketBase, { RecordService } from 'pocketbase';

export interface MyPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'Node'): RecordService<NodeType>;
	collection(idOrName: 'Scenario'): RecordService<Scenario>;
	collection(idOrName: 'End'): RecordService<End>;
	collection(idOrName: 'Event'): RecordService<Event>;
	collection(idOrName: 'Session'): RecordService<Session>;
	collection(idOrName: 'Side'): RecordService<Side>;
	collection(idOrName: 'Users'): RecordService<User>;
}
