import { GET, POST } from "@/app/api/collections/route";
import { auth } from "@/lib/auth";
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
          artworks: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
      });
    });

    it("should return error when collectionIds is missing", async () => {
      const request = new NextRequest(
        `${getServerUrl()}/api/collections?userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Missing collectionIds or userId");
      expect(prismaMock.collection.findMany).not.toHaveBeenCalled();
    });

    it("should return error when userId is missing", async () => {
      const request = new NextRequest(
        `${getServerUrl()}/api/collections?collectionIds=1,2`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Missing collectionIds or userId");
      expect(prismaMock.collection.findMany).not.toHaveBeenCalled();
    });

    it("should return error for invalid collection ID format", async () => {
      const request = new NextRequest(
        `${getServerUrl()}/api/collections?collectionIds=1,invalid,3&userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid collection ID format");
      expect(prismaMock.collection.findMany).not.toHaveBeenCalled();
    });

    it("should handle empty collections array", async () => {
      prismaMock.collection.findMany.mockResolvedValue([]);

      const request = new NextRequest(
        `${getServerUrl()}/api/collections?collectionIds=999&userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });

    it("should handle database errors", async () => {
      prismaMock.collection.findMany.mockRejectedValue(
        new Error("Database error")
      );

      const request = new NextRequest(
        `${getServerUrl()}/api/collections?collectionIds=1&userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Internal server error");
    });
  });

  describe("POST /api/collections", () => {
    it("should create collection for authenticated artist", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockCollection = {
        id: 1,
        userId: "artist1",
        title: "New Collection",
        description: "New Description",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [],
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.collection.create.mockResolvedValue(mockCollection);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "New Collection",
          description: "New Description",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.title).toBe("New Collection");
      expect(prismaMock.collection.create).toHaveBeenCalledWith({
        data: {
          title: "New Collection",
          description: "New Description",
          user: {
            connect: { id: "artist1" },
          },
          artworks: {
            connect: [],
          },
        },
        include: {
          artworks: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
      });
    });

    it("should create collection with artworks", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockCollection = {
        id: 1,
        userId: "artist1",
        title: "Collection with Artworks",
        description: "Description",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [
          { id: 1, title: "Artwork 1", thumbnail: "https://example.com/1.jpg" },
          { id: 2, title: "Artwork 2", thumbnail: "https://example.com/2.jpg" },
        ],
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(2);
      prismaMock.collection.create.mockResolvedValue(mockCollection);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "Collection with Artworks",
          description: "Description",
          artworks: [1, 2],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.artworks).toHaveLength(2);
      expect(prismaMock.artwork.count).toHaveBeenCalledWith({
        where: {
          id: { in: [1, 2] },
          userId: "artist1",
        },
      });
      expect(prismaMock.collection.create).toHaveBeenCalledWith({
        data: {
          title: "Collection with Artworks",
          description: "Description",
          user: {
            connect: { id: "artist1" },
          },
          artworks: {
            connect: [{ id: 1 }, { id: 2 }],
          },
        },
        include: expect.any(Object),
      });
    });

    it("should reject non-artist users", async () => {
      const mockSession = {
        user: {
          id: "user1",
          role: "USER",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "New Collection",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty(
        "error",
        "Unauthorized: Only artists can create collections"
      );
    });

    it("should reject unauthenticated users", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "New Collection",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty("error");
    });

    it("should validate required fields", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          // Missing title
          description: "Description",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid data");
      expect(data).toHaveProperty("details");
    });

    it("should reject when artworks don't belong to user", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      // Return count of 1 when request has 2 artworks
      prismaMock.artwork.count.mockResolvedValue(1);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "Collection",
          artworks: [1, 2],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "error",
        "One or more artworks not found or unauthorized"
      );
    });

    it("should use empty string for description if not provided", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockCollection = {
        id: 1,
        userId: "artist1",
        title: "Collection",
        description: "",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [],
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.collection.create.mockResolvedValue(mockCollection);

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "Collection",
          // No description provided
        }),
      });

      const response = await POST(request);

      expect(response.status).toBe(200);
      expect(prismaMock.collection.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            description: "",
          }),
        })
      );
    });

    it("should handle P2002 error (duplicate title)", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.collection.create.mockRejectedValue(
        new Error("P2002: Unique constraint failed")
      );

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "Existing Collection",
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toHaveProperty(
        "error",
        "A collection with this title already exists"
      );
    });

    it("should handle P2025 error (related record not found)", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(1);
      prismaMock.collection.create.mockRejectedValue(
        new Error("P2025: Record not found")
      );

      const request = new NextRequest(`${getServerUrl()}/api/collections`, {
        method: "POST",
        body: JSON.stringify({
          title: "Collection",
          artworks: [999],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty(
        "error",
        "One or more related records not found"
      );
    });
  });
});
