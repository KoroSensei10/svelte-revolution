import PocketBase from 'pocketbase';
import type { MyPocketBase } from '$types/pocketBase';
import { env } from '$env/dynamic/public';

const DB_URL = env.PUBLIC_DB_URL;

export const pb = new PocketBase(DB_URL) as MyPocketBase;
