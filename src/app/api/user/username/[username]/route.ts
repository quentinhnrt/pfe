import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Validation schema
const paramsSchema = z.object({
  username: z.string().min(1).max(50),
});

// Types
type RouteParams = {
  params: { username: string };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { username } = params;

    // Validate params
    const validation = paramsSchema.safeParse({ username });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid username", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        name: validation.data.username,
      },
      include: {
        posts: {
          include: {
            artworks: true,
            question: {
              include: {
                answers: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        user_template: {
          where: {
            active: true,
          },
          include: {
            template: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by username:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
