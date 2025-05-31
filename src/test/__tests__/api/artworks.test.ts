import { DELETE } from "@/app/api/artworks/[id]/route";
import { GET, POST, PUT } from "@/app/api/artworks/route";
import { auth } from "@/lib/auth";
import { getServerUrl } from "@/lib/server-url";
import { uploadImage } from "@/lib/upload/blob";
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
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              firstname: true,
              lastname: true,
            },
          },
        },
        skip: 0,
        take: 10,
      });
    });

    it("should filter artworks by userId", async () => {
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

      const request = new NextRequest(
        `${getServerUrl()}/api/artworks?userId=user1`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
      expect(data[0].title).toBe("Artwork 1");
      expect(prismaMock.artwork.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              firstname: true,
              lastname: true,
            },
          },
        },
        where: { userId: "user1" },
        skip: 0,
        take: 10,
      });
    });

    it("should filter artworks for sale", async () => {
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

      const request = new NextRequest(
        `${getServerUrl()}/api/artworks?isForSale=true`
      );
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(data[0].id).toBe(1);
      expect(data[0].title).toBe("Artwork 1");
      expect(prismaMock.artwork.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              image: true,
              firstname: true,
              lastname: true,
            },
          },
        },
        where: { isForSale: true, sold: false },
        skip: 0,
        take: 10,
      });
    });

    it("should handle pagination", async () => {
      const mockArtworks = [];
      prismaMock.artwork.findMany.mockResolvedValue(mockArtworks);

      const request = new NextRequest(
        `${getServerUrl()}/api/artworks?page=2&limit=20`
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.artwork.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: expect.any(Object),
        skip: 20,
        take: 20,
      });
    });

    it("should handle database errors", async () => {
      prismaMock.artwork.findMany.mockRejectedValue(
        new Error("Database error")
      );

      const request = new NextRequest(`${getServerUrl()}/api/artworks`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Internal server error");
    });
  });

  describe("POST /api/artworks", () => {
    it("should create artwork for authenticated artist", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockArtwork = {
        id: 1,
        userId: "artist1",
        title: "New Artwork",
        description: "New Description",
        isForSale: true,
        price: 200,
        sold: false,
        thumbnail: "https://example.com/uploaded.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      vi.mocked(uploadImage).mockResolvedValue({
        url: "https://example.com/uploaded.jpg",
      });
      prismaMock.artwork.create.mockResolvedValue(mockArtwork);

      const formData = new FormData();
      formData.append("title", "New Artwork");
      formData.append("description", "New Description");
      formData.append("isForSale", "true");
      formData.append("price", "200");
      formData.append(
        "image",
        new File([""], "test.jpg", { type: "image/jpeg" })
      );

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "POST",
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(1);
      expect(data.title).toBe("New Artwork");
      expect(data.isForSale).toBe(true);
      expect(prismaMock.artwork.create).toHaveBeenCalledWith({
        data: {
          title: "New Artwork",
          description: "New Description",
          isForSale: true,
          price: 200,
          thumbnail: "https://example.com/uploaded.jpg",
          userId: "artist1",
          sold: false,
        },
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

      const formData = new FormData();
      formData.append("title", "New Artwork");

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "POST",
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty(
        "error",
        "Unauthorized: Only artists can create artworks"
      );
    });

    it("should reject unauthenticated users", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const formData = new FormData();
      formData.append("title", "New Artwork");

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "POST",
        body: formData,
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
      vi.mocked(uploadImage).mockResolvedValue({
        url: "https://example.com/uploaded.jpg",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const formData = new FormData();
      formData.append("isForSale", "false");
      formData.append(
        "image",
        new File([""], "test.jpg", { type: "image/jpeg" })
      );
      // Missing title

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "POST",
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid data");
      expect(data).toHaveProperty("details");
    });

    it("should require image", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const formData = new FormData();
      formData.append("title", "New Artwork");
      formData.append("isForSale", "false");
      // Missing image

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "POST",
        body: formData,
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Image is required");
    });
  });

  describe("PUT /api/artworks", () => {
    it("should update artwork for owner", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const existingArtwork = {
        id: 1,
        userId: "artist1",
        title: "Old Title",
        description: "Old Description",
        isForSale: false,
        price: null,
        sold: false,
        thumbnail: "https://example.com/old.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedArtwork = {
        ...existingArtwork,
        title: "Updated Title",
        description: "Updated Description",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue(existingArtwork);
      prismaMock.artwork.update.mockResolvedValue(updatedArtwork);

      const formData = new FormData();
      formData.append("artworkId", "1");
      formData.append("title", "Updated Title");
      formData.append("description", "Updated Description");

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "PUT",
        body: formData,
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.title).toBe("Updated Title");
      expect(data.description).toBe("Updated Description");
      expect(prismaMock.artwork.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          title: "Updated Title",
          description: "Updated Description",
        },
      });
    });

    it("should not allow updating artwork of another user", async () => {
      const mockSession = {
        user: {
          id: "artist2",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue(null);

      const formData = new FormData();
      formData.append("artworkId", "1");
      formData.append("title", "Updated Title");

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "PUT",
        body: formData,
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Artwork not found or unauthorized");
    });

    it("should handle image update", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const existingArtwork = {
        id: 1,
        userId: "artist1",
        title: "Title",
        description: "Description",
        isForSale: false,
        price: null,
        sold: false,
        thumbnail: "https://example.com/old.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue(existingArtwork);
      vi.mocked(uploadImage).mockResolvedValue({
        url: "https://example.com/new.jpg",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      prismaMock.artwork.update.mockResolvedValue({
        ...existingArtwork,
        thumbnail: "https://example.com/new.jpg",
      });

      const formData = new FormData();
      formData.append("artworkId", "1");
      formData.append(
        "image",
        new File([""], "new.jpg", { type: "image/jpeg" })
      );

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "PUT",
        body: formData,
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.thumbnail).toBe("https://example.com/new.jpg");
      expect(prismaMock.artwork.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          thumbnail: "https://example.com/new.jpg",
        },
      });
    });

    it("should validate artwork ID", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const formData = new FormData();
      // Missing artworkId

      const request = new Request(`${getServerUrl()}/api/artworks`, {
        method: "PUT",
        body: formData,
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid data");
    });
  });

  describe("DELETE /api/artworks/[id]", () => {
    it("should delete artwork for owner", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const existingArtwork = {
        id: 1,
        userId: "artist1",
        title: "Artwork to Delete",
        description: "Description",
        isForSale: false,
        price: null,
        sold: false,
        thumbnail: "https://example.com/image.jpg",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue(existingArtwork);
      prismaMock.artwork.delete.mockResolvedValue(existingArtwork);

      const request = new NextRequest(`${getServerUrl()}/api/artworks/1`);
      const response = await DELETE(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveProperty("message", "Artwork deleted successfully");
      expect(prismaMock.artwork.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it("should not allow deleting artwork of another user", async () => {
      const mockSession = {
        user: {
          id: "artist2",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue(null);

      const request = new NextRequest(`${getServerUrl()}/api/artworks/1`);
      const response = await DELETE(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Artwork not found or unauthorized");
      expect(prismaMock.artwork.delete).not.toHaveBeenCalled();
    });

    it("should validate artwork ID", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/artworks/invalid`);
      const response = await DELETE(request, { params: { id: "invalid" } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid artwork ID");
    });

    it("should handle P2025 error (not found)", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.findFirst.mockResolvedValue({
        id: 1,
        userId: "artist1",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      prismaMock.artwork.delete.mockRejectedValue(
        new Error("P2025: Record not found")
      );

      const request = new NextRequest(`${getServerUrl()}/api/artworks/1`);
      const response = await DELETE(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Artwork not found");
    });

    it("should handle P2003 error (foreign key constraint)", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      prismaMock.artwork.findFirst.mockResolvedValue({
        id: 1,
        userId: "artist1",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
      prismaMock.artwork.delete.mockRejectedValue(
        new Error("P2003: Foreign key constraint failed")
      );

      const request = new NextRequest(`${getServerUrl()}/api/artworks/1`);
      const response = await DELETE(request, { params: { id: "1" } });
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data).toHaveProperty(
        "error",
        "Cannot delete artwork: it has related records"
      );
    });
  });
});
