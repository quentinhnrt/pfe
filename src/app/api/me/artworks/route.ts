import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Artwork } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Validation schema
const getMyArtworksSchema = z.object({
  artworks: z
    .string()
    .nullable()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val
        .split(",")
        .filter(Boolean)
        .map(Number)
        .filter((n) => !isNaN(n));
    }),
  perPage: z.string().nullable().optional().transform((val) => {
    if (!val) return 10;
    const num = parseInt(val, 10);
    return isNaN(num) ? 10 : Math.min(Math.max(num, 1), 100);
  }),
  page: z.string().nullable().optional().transform((val) => {
    if (!val) return 0;
    const num = parseInt(val, 10);
    return isNaN(num) ? 0 : Math.max(num, 0);
  }),
  title: z.string().nullable().optional().transform((val) => val || ""),
});

// Types
type MyArtworksResponse = {
  artworks: Artwork[];
  initialArtworks: Artwork[];
};

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;

    // Validate parameters
    const validation = getMyArtworksSchema.safeParse({
      artworks: searchParams.get("artworks"),
      perPage: searchParams.get("perPage"),
      page: searchParams.get("page"),
      title: searchParams.get("title"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { artworks: excludedArtworkIds, perPage, page, title } = validation.data;

    // Fetch artworks excluding specified IDs
    const artworks = await prisma.artwork.findMany({
      take: perPage,
      skip: page * perPage,
      where: {
        userId: session.user.id,
        ...(excludedArtworkIds.length > 0 && {
          NOT: {
            id: {
              in: excludedArtworkIds,
            },
          },
        }),
        ...(title && {
          title: {
            contains: title,
            mode: "insensitive",
          },
        }),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Fetch initial artworks (the ones that were specified in the request)
    const initialArtworks = excludedArtworkIds.length > 0
      ? await prisma.artwork.findMany({
          where: {
            userId: session.user.id,
            id: {
              in: excludedArtworkIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    const response: MyArtworksResponse = {
      artworks,
      initialArtworks,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user artworks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}