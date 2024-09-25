// See https://kit.svelte.dev/docs/types#app
import type { MyPocketBase } from '$types/pocketBase';
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
			pb: MyPocketBase;
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
