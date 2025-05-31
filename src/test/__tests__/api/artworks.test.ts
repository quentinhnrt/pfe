import { GET } from "@/app/api/artworks/route";
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

// Mock upload module
vi.mock("@/lib/upload/blob", () => ({
  uploadImage: vi.fn(),
}));

// Mock headers
vi.mock("next/headers", () => ({
  headers: vi.fn(() => Promise.resolve(new Headers())),
}));

describe("Artworks API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/artworks", () => {
    it("should return all artworks without filters", async () => {
      const mockArtworks = [
        {
          id: 1,
          userId: "user1",
          title: "Artwork 1",
          description: "Description 1",
          isForSale: true,
          price: 100,
          sold: false,
          thumbnail: "https://example.com/image1.jpg",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          user: {
            id: "user1",
            name: "artist1",
            image: null,
            firstname: "John",
            lastname: "Doe",
          },
        },
      ];

      prismaMock.artwork.findMany.mockResolvedValue(mockArtworks);

      const request = new NextRequest(`${getServerUrl()}/api/artworks`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
      expect(data[0].title).toBe("Artwork 1");
      expect(prismaMock.artwork.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
        },
      });
    });
  });
});
