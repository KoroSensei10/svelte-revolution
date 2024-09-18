export interface Lang {
	name: 'fr' | 'en' | 'jp';
}

export interface NodeType {
	id: string;
	title: string;
	text: string;
	author: string;
	session: string;
	type: string;
	parent: string;
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

export interface Event {
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
}

export interface Side {
	id: string;
	name: string;
}
