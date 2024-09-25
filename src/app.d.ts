// See https://kit.svelte.dev/docs/types#app

import type { User } from '../types/tableTypes';

// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			status: number;
			message: string;
			code?: string;
		}
		interface Locals {
			pb: PocketBase;
		}
		interface ServerLoadEvent {
			user: User | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
