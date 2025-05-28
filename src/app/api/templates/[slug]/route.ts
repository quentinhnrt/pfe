import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Template } from "@prisma/client";
import prisma from "@/lib/prisma";

// Validation schema
const paramsSchema = z.object({
  slug: z.string().min(1).max(100),
});

// Types
type RouteParams = {
  params: { slug: string };
};

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = params;

    // Validate params
    const validation = paramsSchema.safeParse({ slug });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid template slug", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const template = await prisma.template.findUnique({
      where: {
        slug: validation.data.slug,
      },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json<Template>(template);
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}