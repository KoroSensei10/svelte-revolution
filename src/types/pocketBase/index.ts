import PocketBase, { RecordService } from 'pocketbase';
import type { End, GraphEvent, GraphNode, Scenario, Session, Side, User } from '$types/pocketBase/TableTypes';

export interface MyPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'Node'): RecordService<GraphNode>;
	collection(idOrName: 'Scenario'): RecordService<Scenario>;
	collection(idOrName: 'End'): RecordService<End>;
	collection(idOrName: 'Event'): RecordService<GraphEvent>;
	collection(idOrName: 'Session'): RecordService<Session>;
	collection(idOrName: 'Side'): RecordService<Side>;
	collection(idOrName: 'Users'): RecordService<User>;
}
