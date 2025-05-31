import { GET, POST, PUT } from "@/app/api/posts/route";
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

    it("should return posts with custom pagination", async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const request = new NextRequest(
        `${getServerUrl()}/api/posts?page=2&limit=20`
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 20,
          skip: 20,
        })
      );
    });

    it("should filter posts by userId", async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const request = new NextRequest(
        `${getServerUrl()}/api/posts?userId=artist1`
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "artist1" },
        })
      );
    });

    it("should work without authentication", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);
      prismaMock.post.findMany.mockResolvedValue([]);

      const request = new NextRequest(`${getServerUrl()}/api/posts`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            question: expect.objectContaining({
              include: expect.objectContaining({
                answers: expect.objectContaining({
                  include: expect.objectContaining({
                    users: {
                      where: { id: "" },
                    },
                  }),
                }),
              }),
            }),
          }),
        })
      );
    });

    it("should enforce pagination limits", async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const request = new NextRequest(`${getServerUrl()}/api/posts?limit=200`);
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 100, // Max limit
        })
      );
    });

    it("should handle invalid pagination parameters", async () => {
      prismaMock.post.findMany.mockResolvedValue([]);

      const request = new NextRequest(
        `${getServerUrl()}/api/posts?page=invalid&limit=invalid`
      );
      const response = await GET(request);

      expect(response.status).toBe(200);
      expect(prismaMock.post.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          take: 10,
          skip: 0,
        })
      );
    });

    it("should handle database errors", async () => {
      prismaMock.post.findMany.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(`${getServerUrl()}/api/posts`);
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Internal server error");
    });
  });

  describe("POST /api/posts", () => {
    it("should create post without question for authenticated artist", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockPost = {
        id: 1,
        userId: "artist1",
        content: "New post content",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [{ id: 1 }],
        question: null,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(1);
      prismaMock.$transaction.mockImplementation(async (callback) => {
        const tx = {
          post: {
            create: vi.fn().mockResolvedValue(mockPost),
            findUnique: vi.fn().mockResolvedValue(mockPost),
          },
          question: {
            create: vi.fn(),
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return callback(tx as any);
      });

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "New post content",
          artworks: [1],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.content).toBe("New post content");
      expect(prismaMock.artwork.count).toHaveBeenCalledWith({
        where: {
          id: { in: [1] },
          userId: "artist1",
        },
      });
    });

    it("should create post with question and answers", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const mockPost = {
        id: 1,
        userId: "artist1",
        content: "Post with question",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [{ id: 1 }],
        question: {
          id: 1,
          question: "What do you think?",
          answers: [
            { id: 1, content: "Option 1" },
            { id: 2, content: "Option 2" },
          ],
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(1);
      prismaMock.$transaction.mockImplementation(async (callback) => {
        const tx = {
          post: {
            create: vi.fn().mockResolvedValue({ ...mockPost, question: null }),
            findUnique: vi.fn().mockResolvedValue(mockPost),
          },
          question: {
            create: vi.fn(),
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return callback(tx as any);
      });

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "Post with question",
          artworks: [1],
          question: "What do you think?",
          answers: ["Option 1", "Option 2"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data.question).toBeDefined();
      expect(data.question.answers).toHaveLength(2);
    });

    it("should reject non-artist users", async () => {
      const mockSession = {
        user: {
          id: "user1",
          role: "USER",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "New post",
          artworks: [1],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty(
        "error",
        "Unauthorized: Only artists can create posts"
      );
    });

    it("should reject unauthenticated users", async () => {
      vi.mocked(auth.api.getSession).mockResolvedValue(null);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "New post",
          artworks: [1],
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

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          // Missing content and artworks
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid data");
      expect(data).toHaveProperty("details");
    });

    it("should require at least one artwork", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "Post content",
          artworks: [], // Empty array
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty("error", "Invalid data");
    });

    it("should reject question without answers", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(1);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "Post content",
          artworks: [1],
          question: "What do you think?",
          // Missing answers
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "error",
        "Both question and answers must be provided together"
      );
    });

    it("should require at least 2 answers for a question", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(1);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "Post content",
          artworks: [1],
          question: "What do you think?",
          answers: ["Only one answer"],
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "error",
        "At least 2 answers are required for a question"
      );
    });

    it("should reject when artworks don't belong to user", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.artwork.count.mockResolvedValue(0); // No artworks found

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "POST",
        body: JSON.stringify({
          content: "Post content",
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
  });

  describe("PUT /api/posts", () => {
    it("should update post for owner", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      const existingPost = {
        id: 1,
        userId: "artist1",
        content: "Old content",
      };

      const updatedPost = {
        id: 1,
        userId: "artist1",
        content: "Updated content",
        createdAt: new Date(),
        updatedAt: new Date(),
        artworks: [{ id: 2 }],
        question: null,
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.post.findFirst.mockResolvedValue(existingPost as any);
      prismaMock.artwork.count.mockResolvedValue(1);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.post.update.mockResolvedValue(updatedPost as any);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: 1,
          content: "Updated content",
          artworks: [2],
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.content).toBe("Updated content");
      expect(prismaMock.post.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: {
          content: "Updated content",
          artworks: {
            set: [{ id: 2 }],
          },
          updatedAt: expect.any(Date),
        },
        include: {
          artworks: true,
          question: {
            include: {
              answers: true,
            },
          },
        },
      });
    });

    it("should not allow updating post of another user", async () => {
      const mockSession = {
        user: {
          id: "artist2",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.post.findFirst.mockResolvedValue(null);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: 1,
          content: "Updated content",
          artworks: [1],
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data).toHaveProperty("error", "Post not found or unauthorized");
    });

    it("should reject non-artist users", async () => {
      const mockSession = {
        user: {
          id: "user1",
          role: "USER",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: 1,
          content: "Updated content",
          artworks: [1],
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(403);
      expect(data).toHaveProperty(
        "error",
        "Unauthorized: Only artists can update posts"
      );
    });

    it("should validate required fields", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          // Missing required fields
        }),
      });

      const response = await PUT(request);
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

      const existingPost = {
        id: 1,
        userId: "artist1",
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      prismaMock.post.findFirst.mockResolvedValue(existingPost as any);
      prismaMock.artwork.count.mockResolvedValue(0); // No artworks found

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: 1,
          content: "Updated content",
          artworks: [999],
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data).toHaveProperty(
        "error",
        "One or more artworks not found or unauthorized"
      );
    });

    it("should handle database errors", async () => {
      const mockSession = {
        user: {
          id: "artist1",
          role: "ARTIST",
        },
      };

      vi.mocked(auth.api.getSession).mockResolvedValue(mockSession);
      prismaMock.post.findFirst.mockRejectedValue(new Error("Database error"));

      const request = new NextRequest(`${getServerUrl()}/api/posts`, {
        method: "PUT",
        body: JSON.stringify({
          postId: 1,
          content: "Updated content",
          artworks: [1],
        }),
      });

      const response = await PUT(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data).toHaveProperty("error", "Internal server error");
    });
  });
});
