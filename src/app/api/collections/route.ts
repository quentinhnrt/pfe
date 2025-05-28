import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schemas
const createCollectionSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  artworks: z.array(z.number().int().positive()).optional().default([]),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const collectionIds = searchParams.get("collectionIds");
    const userId = searchParams.get("userId");

    if (!collectionIds || !userId) {
      return NextResponse.json(
        { error: "Missing collectionIds or userId" },
        { status: 400 }
      );
    }

    // Parse collection IDs
    const ids = collectionIds.split(",").map((id) => parseInt(id, 10));

    // Validate parsed IDs
    if (ids.some(isNaN)) {
      return NextResponse.json(
        { error: "Invalid collection ID format" },
        { status: 400 }
      );
    }

    const collections = await prisma.collection.findMany({
      where: {
        id: {
          in: ids,
        },
        userId: userId,
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

    return NextResponse.json(collections);
  } catch (error) {
    console.error("Error fetching collections:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can create collections" },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = createCollectionSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, artworks } = validation.data;

    // Verify that all artworks exist and belong to the user
    if (artworks.length > 0) {
      const artworkCount = await prisma.artwork.count({
        where: {
          id: {
            in: artworks,
          },
          userId: session.user.id,
        },
      });

      if (artworkCount !== artworks.length) {
        return NextResponse.json(
          { error: "One or more artworks not found or unauthorized" },
          { status: 400 }
        );
      }
    }

    // Create the collection
    const collection = await prisma.collection.create({
      data: {
        title,
        description: description || "",
        user: {
          connect: { id: session.user.id },
        },
        artworks: {
          connect: artworks.map((id) => ({ id })),
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

    return NextResponse.json(collection);
  } catch (error) {
    console.error("Error creating collection:", error);

    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "A collection with this title already exists" },
          { status: 409 }
        );
      }

      if (error.message.includes("P2025")) {
        return NextResponse.json(
          { error: "One or more related records not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
