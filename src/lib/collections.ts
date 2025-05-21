import {Prisma} from "@prisma/client";

export type CollectionFromAPI = Prisma.CollectionGetPayload<{
    include: {
        artworks: true;
    };
}>

export async function getCollectionsFromFieldValue(collectionIds: number[], userId: string): Promise<CollectionFromAPI[]> {
    const baseUrl = process.env.BETTER_AUTH_URL || "";
    const queryParams = new URLSearchParams({
        collectionIds: collectionIds.join(","),
        userId: userId,
    })

    const url = baseUrl + "/api/collections?" + queryParams.toString();

    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })

    if (!response.ok) {
        throw new Error("Failed to fetch collections");
    }

    return await response.json();
}