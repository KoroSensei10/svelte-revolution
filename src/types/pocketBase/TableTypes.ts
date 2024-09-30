declare module '$types/pocketBase/TableTypes' {
	export type NodeType = 'contribution' | 'event' | 'startNode';

	export interface Lang {
		name: 'fr' | 'en' | 'jp';
	}

	export interface GraphNode {
		id: string;
		title: string;
		text: string;
		author: string;
		session: string;
		type: NodeType;
		parent: string;
		side: string;
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
		end?: string;
		expand: Record<string, Scenario | GraphEvent | End>;
	}

	export interface Side {
		id: string;
		name: string;
	}

	export interface User {
		id: string;
		name?: string;
		username: string;
		email: string;
		avatar?: string;
	}
}
