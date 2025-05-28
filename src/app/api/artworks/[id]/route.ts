import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

// Validation schema
const paramsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Route params type
type RouteParams = {
  params: { id: string };
};

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Validate params
    const validation = paramsSchema.safeParse({
      id: params.id,
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid artwork ID", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { id: artworkId } = validation.data;

    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can delete artworks" },
        { status: 403 }
      );
    }

    // Check if artwork exists and belongs to user
    const artwork = await prisma.artwork.findFirst({
      where: {
        id: artworkId,
        userId: session.user.id,
      },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: "Artwork not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete the artwork
    await prisma.artwork.delete({
      where: {
        id: artworkId,
      },
    });

    return NextResponse.json(
      { message: "Artwork deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting artwork:", error);
    
    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("P2025")) {
        return NextResponse.json(
          { error: "Artwork not found" },
          { status: 404 }
        );
      }
      
      if (error.message.includes("P2003")) {
        return NextResponse.json(
          { error: "Cannot delete artwork: it has related records" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}