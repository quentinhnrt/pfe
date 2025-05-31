import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Validation schemas
const paramsSchema = z.object({
  answerId: z.coerce.number().int().positive(),
});

const bodySchema = z.object({
  questionId: z.coerce.number().int().positive(),
});

// Types
type RouteParams = {
  params: { answerId: string; questionId: string };
};

export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
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

    const { answerId } = params;
    
    // Validate params
    const paramsValidation = paramsSchema.safeParse({ answerId });

    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid answer ID", details: paramsValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Parse and validate body
    const body = await request.json();
    const bodyValidation = bodySchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: bodyValidation.error.flatten() },
        { status: 400 }
      );
    }

    const { questionId } = bodyValidation.data;

    // Check if answer exists and belongs to the question
    const answer = await prisma.answer.findFirst({
      where: {
        id: paramsValidation.data.answerId,
        questionId: questionId,
      },
    });

    if (!answer) {
      return NextResponse.json(
        { error: "Answer not found or does not belong to this question" },
        { status: 404 }
      );
    }

    // Check if user has already answered this question
    const userAlreadyAnswered = await prisma.answer.findFirst({
      where: {
        users: {
          some: {
            id: session.user.id,
          },
        },
        questionId: questionId,
      },
    });

    if (userAlreadyAnswered) {
      return NextResponse.json(
        { error: "You have already answered this question" },
        { status: 409 }
      );
    }

    // Update answer with user's vote
    const updatedAnswer = await prisma.answer.update({
      where: {
        id: paramsValidation.data.answerId,
      },
      data: {
        votes: {
          increment: 1,
        },
        users: {
          connect: {
            id: session.user.id,
          },
        },
      },
      include: {
        users: {
          select: {
            id: true,
          },
        },
      },
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.error("Error voting on answer:", error);
    
    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("P2025")) {
        return NextResponse.json(
          { error: "Answer not found" },
          { status: 404 }
        );
      }
      
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "You have already voted on this answer" },
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