import { Prisma } from "@prisma/client";
import { getServerUrl } from "./server-url";

export type CollectionFromAPI = Prisma.CollectionGetPayload<{
  include: {
    artworks: true;
  };
}>;

export async function getCollectionsFromFieldValue(
  collectionIds: number[],
  userId: string
): Promise<CollectionFromAPI[]> {
  const baseUrl = getServerUrl() || "";
  const queryParams = new URLSearchParams({
    collectionIds: collectionIds.join(","),
    userId: userId,
  });

  const url = baseUrl + "/api/collections?" + queryParams.toString();

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch collections");
  }

  return await response.json();
}
