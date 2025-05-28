import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

// Validation schemas
const paramsSchema = z.object({
  id: z.string(),
});

const querySchema = z.object({
  active: z.string().nullable().optional(),
});

// Types
type RouteParams = {
  params: { id: string };
};


export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;
    const searchParams = request.nextUrl.searchParams;

    // Validate params
    const paramsValidation = paramsSchema.safeParse({ id });

    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid user ID", details: paramsValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Validate query params
    const queryValidation = querySchema.safeParse({
      active: searchParams.get("active"),
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: "Invalid query parameters", details: queryValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: paramsValidation.data.id },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Build query
    const query: Prisma.UserTemplateFindManyArgs = {
      where: {
        userId: paramsValidation.data.id,
      },
      include: {
        template: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    // Add active filter if provided
    if (queryValidation.data.active !== undefined) {
      query.where!.active = queryValidation.data.active === "true";
    }

    const templates = await prisma.userTemplate.findMany(query);

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching user templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}