import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Collection } from "@prisma/client";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Validation schema
const getMyCollectionsSchema = z.object({
  collections: z
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
type MyCollectionsResponse = {
  collections: Collection[];
  initialCollections: Collection[];
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
    const validation = getMyCollectionsSchema.safeParse({
      collections: searchParams.get("collections"),
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

    const { collections: excludedCollectionIds, perPage, page, title } = validation.data;

    // Fetch collections excluding specified IDs
    const collections = await prisma.collection.findMany({
      take: perPage,
      skip: page * perPage,
      where: {
        userId: session.user.id,
        ...(excludedCollectionIds.length > 0 && {
          NOT: {
            id: {
              in: excludedCollectionIds,
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

    // Fetch initial collections (the ones that were specified in the request)
    const initialCollections = excludedCollectionIds.length > 0
      ? await prisma.collection.findMany({
          where: {
            userId: session.user.id,
            id: {
              in: excludedCollectionIds,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })
      : [];

    const response: MyCollectionsResponse = {
      collections,
      initialCollections,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching user collections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}