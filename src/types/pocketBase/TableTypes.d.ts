declare module '$types/pocketBase/TableTypes' {
	export type NodeType = 'contribution' | 'event' | 'startNode';
	export type Lang = 'fr' | 'en' | 'jp';
	export type Role = 'admin' | 'user' | 'superAdmin'; // see in the database

	export interface GraphNode {
		id: string;
		title: string;
		text: string;
		author: string;
		session: string;
		type: NodeType;
		parent: string;
		side: string;
		expand?: {
			side?: Side;
		};
	}

	export interface Scenario {
		id: string;
		title: string;
		prologue: string;
		lang: Lang;
		firstNodeTitle: string;
		firstNodeText: string;
		firstNodeAuthor: string;
	}

	export interface End {
		id: string;
		title: string;
		text: string;
	}

	export interface GraphEvent {
		id: string;
		title: string;
		text: string;
		author: string;
	}

	export interface Session {
		id: string;
		slug: number;
		name: string;
		image: string;
		completed: boolean;
		visible: boolean;
		public: boolean;
		scenario: string;
		events: string[];
		author: string;
		end?: string;
		expand: {
			scenario: Scenario;
			end: End;
			events: GraphEvent[];
		};
	}

	export interface Side {
		id: string;
		name: string;
	}

	export interface User {
		id: string;
		username: string;
		role: Role;
		email?: string;
		name?: string;
		avatar?: string;
	}
}
