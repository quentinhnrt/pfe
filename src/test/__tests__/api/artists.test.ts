import { GET } from "@/app/api/artists/route";
import { getServerUrl } from "@/lib/server-url";
import { prismaMock } from "@/test/mocks/prisma";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it } from "vitest";

describe("GET /api/artists", () => {
  beforeEach(() => {
    // Mocks are automatically reset by vitest-mock-extended
  });

  it("should return empty array when no search query is provided", async () => {
    const request = new NextRequest(`${getServerUrl()}/api/artists`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual([]);
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should return artists matching the search query", async () => {
    const mockArtists = [
      {
        id: "1",
        email: "artist1@example.com",
        firstname: "John",
        lastname: "Doe",
        name: "johndoe",
        emailVerified: true,
        role: "ARTIST" as const,
        image: "https://example.com/image1.jpg",
        bannerImage: null,
        bio: "Artist bio",
        location: "Paris",
        website: "https://johndoe.com",
        onBoarded: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(mockArtists);

    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=john`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe("1");
    expect(data[0].name).toBe("johndoe");

    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "john", mode: "insensitive" } },
          { firstname: { contains: "john", mode: "insensitive" } },
          { lastname: { contains: "john", mode: "insensitive" } },
        ],
        role: "ARTIST",
      },
      select: expect.any(Object),
    });
  });

  it("should return 400 for invalid search parameters", async () => {
    const longSearch = "a".repeat(101);
    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=${longSearch}`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("error", "Invalid search parameters");
    expect(data).toHaveProperty("details");
    expect(prismaMock.user.findMany).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    prismaMock.user.findMany.mockRejectedValue(
      new Error("Database connection failed")
    );

    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=test`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty("error", "Internal server error");
    expect(prismaMock.user.findMany).toHaveBeenCalledTimes(1);
  });

  it("should return 404 for P2025 Prisma error", async () => {
    const prismaError = new Error("P2025: Record not found");
    prismaMock.user.findMany.mockRejectedValue(prismaError);

    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=test`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty("error", "Record not found");
  });

  it("should return 409 for P2002 Prisma error", async () => {
    const prismaError = new Error("P2002: Unique constraint failed");
    prismaMock.user.findMany.mockRejectedValue(prismaError);

    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=test`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toHaveProperty("error", "Database constraint violation");
  });

  it("should search case-insensitively across all name fields", async () => {
    const mockArtists = [
      {
        id: "1",
        email: "artist1@example.com",
        firstname: "Marie",
        lastname: "DUPONT",
        name: "mariedupont",
        emailVerified: true,
        role: "ARTIST" as const,
        image: null,
        bannerImage: null,
        bio: null,
        location: null,
        website: null,
        onBoarded: true,
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
      },
    ];

    prismaMock.user.findMany.mockResolvedValue(mockArtists);

    const request = new NextRequest(
      `${getServerUrl()}/api/artists?search=MARIE`
    );
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].firstname).toBe("Marie");

    expect(prismaMock.user.findMany).toHaveBeenCalledWith({
      where: {
        OR: [
          { name: { contains: "MARIE", mode: "insensitive" } },
          { firstname: { contains: "MARIE", mode: "insensitive" } },
          { lastname: { contains: "MARIE", mode: "insensitive" } },
        ],
        role: "ARTIST",
      },
      select: expect.any(Object),
    });
  });
});
