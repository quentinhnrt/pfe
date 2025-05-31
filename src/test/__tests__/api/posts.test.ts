import { GET } from "@/app/api/posts/route";
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

describe("Posts API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/posts", () => {
    it("should return posts with default pagination", async () => {
      const mockSession = {
        user: {
          id: "user1",
          role: "USER",
        },
      };

      const mockPosts = [
        {
          id: 1,
          userId: "artist1",
          content: "Post content",
          createdAt: new Date("2024-01-01"),
          updatedAt: new Date("2024-01-01"),
          artworks: [
            {
              id: 1,
              title: "Artwork 1",
              thumbnail: "https://example.com/1.jpg",
            },
          ],
          question: null,
          user: {
            id: "artist1",
            name: "artist1",
            email: "artist1@example.com",
          },
        },
      ];

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.post.findMany.mockResolvedValue(mockPosts as any);

      const request = new NextRequest(`${getServerUrl()}/api/posts`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toHaveLength(1);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: "desc" },
        include: {
          artworks: true,
          question: {
            include: {
              answers: {
                include: {
                  users: {
                    where: { id: "user1" },
                  },
                },
              },
            },
          },
          user: true,
        },
        take: 10,
        skip: 0,
      });
    });
  });
});
