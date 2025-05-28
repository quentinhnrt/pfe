import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

// Validation schema for search parameters
const searchParamsSchema = z.object({
  search: z.string().min(1).max(100).optional(),
});

// Type for the API response
type ArtistsResponse = User[];

export async function GET(request: NextRequest) {
  try {
    // Parse and validate search parameters
    const searchParams = request.nextUrl.searchParams;
    const validationResult = searchParamsSchema.safeParse({
      search: searchParams.get("search"),
    });

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Invalid search parameters",
          details: validationResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const { search } = validationResult.data;

    // Return empty array if no search query provided
    if (!search) {
      return NextResponse.json<ArtistsResponse>([]);
    }

    // Build search conditions
    const searchConditions = {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          firstname: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          lastname: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    };

    // Query artists from database
    const artists = await prisma.user.findMany({
      where: {
        ...searchConditions,
        role: "ARTIST",
      },
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        name: true,
        emailVerified: true,
        role: true,
        image: true,
        bannerImage: true,
        bio: true,
        location: true,
        website: true,
        onBoarded: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json<ArtistsResponse>(artists);
  } catch (error) {
    console.error("Error fetching artists:", error);

    if (error instanceof Error) {
      if (error.message.includes("P2025")) {
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      }

      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Database constraint violation" },
          { status: 409 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
