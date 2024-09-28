import PocketBase from 'pocketbase';
import type { MyPocketBase } from '$types/pocketBase';

const dbUrl = import.meta.env.VITE_DB_URL as string;

export const pb = new PocketBase(dbUrl) as MyPocketBase;
