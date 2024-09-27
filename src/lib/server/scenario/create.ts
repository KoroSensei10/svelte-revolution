import { pb } from "$lib/pocketbase";

export async function createScenario(data: {
    title: FormDataEntryValue;
    prologue: FormDataEntryValue;
    lang: FormDataEntryValue;
    firstNodeTitle: FormDataEntryValue;
    firstNodeText: FormDataEntryValue;
    firstNodeAuthor: FormDataEntryValue;
}) {
    return pb.collection('scenario').create(data);
}

export async function createEventsAndEnds(
    scenarioId: string,
    events: FormDataEntryValue[],
    eventTexts: FormDataEntryValue[],
    eventAuthors: FormDataEntryValue[],
    ends: FormDataEntryValue[],
    endTexts: FormDataEntryValue[]
) {
    const eventPromises = events.map((event, i) =>
        pb.collection('event').create({
            title: event,
            text: eventTexts[i],
            author: eventAuthors[i],
            scenario: scenarioId
        })
    );

    const endPromises = ends.map((end, i) =>
        pb.collection('end').create({
            title: end,
            text: endTexts[i],
            scenario: scenarioId
        })
    );

    await Promise.all([...eventPromises, ...endPromises]);
}