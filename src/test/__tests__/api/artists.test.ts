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
});
