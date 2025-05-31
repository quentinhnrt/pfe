import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Validation schemas
const createUserTemplateSchema = z.object({
  data: z.record(z.unknown()),
  templateId: z.number().int().positive(),
  active: z.boolean().optional(),
});

const updateUserTemplateSchema = z.object({
  data: z.record(z.unknown()),
  templateId: z.number().int().positive(),
  active: z.boolean().optional(),
  userTemplateId: z.number().int().positive(),
});

// Types
type TemplateWithUserData = Prisma.TemplateGetPayload<{
  include: {
    user_template: {
      where: { userId: string };
      select: {
        active: true;
        data: true;
      };
    };
  };
}>;

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can access templates" },
        { status: 403 }
      );
    }

    const templates = await prisma.template.findMany({
      include: {
        user_template: {
          where: {
            userId: session.user.id,
          },
          select: {
            active: true,
            data: true,
          },
        },
      },
    });

    return NextResponse.json<TemplateWithUserData[]>(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can create templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createUserTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { data, templateId, active } = validation.data;

    // Verify template exists
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Check if user already has this template
    const existingUserTemplate = await prisma.userTemplate.findUnique({
      where: {
        userId_templateId: {
          userId: session.user.id,
          templateId: templateId,
        },
      },
    });

    if (existingUserTemplate) {
      return NextResponse.json(
        { error: "User template already exists. Use PUT to update." },
        { status: 409 }
      );
    }

    // If activating this template, deactivate all others
    if (active) {
      await prisma.userTemplate.updateMany({
        where: {
          userId: session.user.id,
          active: true,
        },
        data: {
          active: false,
        },
      });
    }

    // Create new user template
    const newUserTemplate = await prisma.userTemplate.create({
      data: {
        userId: session.user.id,
        templateId: templateId,
        data: data as Prisma.JsonObject,
        active: active ?? false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        userTemplateId: newUserTemplate.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can update templates" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updateUserTemplateSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { data, templateId, active } = validation.data;

    // Verify user template exists
    const existingUserTemplate = await prisma.userTemplate.findUnique({
      where: {
        userId_templateId: {
          userId: session.user.id,
          templateId: templateId,
        },
      },
    });

    if (!existingUserTemplate) {
      return NextResponse.json(
        { error: "User template not found" },
        { status: 404 }
      );
    }

    // If activating this template, deactivate all others
    if (active) {
      await prisma.userTemplate.updateMany({
        where: {
          userId: session.user.id,
          active: true,
          NOT: {
            id: existingUserTemplate.id,
          },
        },
        data: {
          active: false,
        },
      });
    }

    // Update user template
    const updatedUserTemplate = await prisma.userTemplate.update({
      where: {
        id: existingUserTemplate.id,
      },
      data: {
        data: data as Prisma.JsonObject,
        active: active ?? existingUserTemplate.active,
      },
    });

    return NextResponse.json({
      success: true,
      userTemplateId: updatedUserTemplate.id,
    });
  } catch (error) {
    console.error("Error updating user template:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}