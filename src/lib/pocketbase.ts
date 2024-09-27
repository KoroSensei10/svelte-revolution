import PocketBase from 'pocketbase';
import type { MyPocketBase } from '$types/pocketBase';

export const pb = new PocketBase('https://db.canard.cc') as MyPocketBase;
