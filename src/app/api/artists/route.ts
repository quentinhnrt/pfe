import prisma from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  if (!searchParams.has("search")) {
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  const artists = await prisma.user.findMany({
    where: {
      OR: [
        {
          name: {
            contains: searchParams.get("search") as string,
            mode: "insensitive",
          },
        },
        {
          firstname: {
            contains: searchParams.get("search") as string,
            mode: "insensitive",
          },
        },
        {
          lastname: {
            contains: searchParams.get("search") as string,
            mode: "insensitive",
          },
        },
      ],
      role: "ARTIST",
    },
  });

  return new Response(JSON.stringify(artists), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
