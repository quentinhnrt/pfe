import { GET } from "@/app/api/collections/route";
import { getServerUrl } from "@/lib/server-url";
import { prismaMock } from "@/test/mocks/prisma";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock auth module
vi.mock("@/lib/auth", () => ({
  auth: {
    api: {
      getSession: vi.fn(),
    },
  },
}));

// Mock headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Collections API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/collections", () => {
    it("should return collections by IDs and userId", async () => {
      const mockCollections = [
        {
          id: 1,
          userId: "user1",
          title: "Collection 1",
          description: "Description 1",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          artworks: [
            {
              id: 1,
              title: "Artwork 1",
              thumbnail: "https://example.com/artwork1.jpg",
            },
          ],
        },
        {
          id: 2,
          userId: "user1",
          title: "Collection 2",
          description: "Description 2",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          artworks: [],
        },
      ];

      prismaMock.collection.findMany.mockResolvedValue(mockCollections);

      const request = new NextRequest(
        `${getServerUrl()}/api/collections?collectionIds=1,2&userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe(1);
      expect(data[0].artworks).toHaveLength(1);
      expect(prismaMock.collection.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: [1, 2],
          },
          userId: "user1",
        },
        include: {
          artworks: true,
        },
      });
    });
  });
});
