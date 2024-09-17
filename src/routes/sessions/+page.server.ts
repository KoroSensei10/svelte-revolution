import { pb } from "$lib/pocketbase";


export async function load () {
    return {sessions: await pb.collection("session").getFullList({expand: 'scenario'})};
}