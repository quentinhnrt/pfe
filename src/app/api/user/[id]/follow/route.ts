import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// Validation schemas
const paramsSchema = z.object({
  id: z.string(),
});

const bodySchema = z.object({
  followerId: z.string(),
});

// Types
type RouteParams = {
  params: { id: string };
};

type FollowResponse = {
  followed: boolean;
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

    const { id: followingId } = params;
    const body = await request.json();

    // Validate params
    const paramsValidation = paramsSchema.safeParse({ id: followingId });

    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid user ID", details: paramsValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Validate body
    const bodyValidation = bodySchema.safeParse(body);

    if (!bodyValidation.success) {
      return NextResponse.json(
        { error: "Invalid request data", details: bodyValidation.error.flatten() },
        { status: 400 }
      );
    }

    const { followerId } = bodyValidation.data;

    // Verify the follower is the authenticated user
    if (followerId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only manage your own follows" },
        { status: 403 }
      );
    }

    // Check if trying to follow self
    if (followerId === paramsValidation.data.id) {
      return NextResponse.json(
        { error: "You cannot follow yourself" },
        { status: 400 }
      );
    }

    // Check if both users exist and following user is an artist
    const [follower, following] = await Promise.all([
      prisma.user.findUnique({ 
        where: { id: followerId },
        select: { id: true },
      }),
      prisma.user.findUnique({ 
        where: { id: paramsValidation.data.id },
        select: { id: true, role: true },
      }),
    ]);

    if (!follower || !following) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (following.role !== "ARTIST") {
      return NextResponse.json(
        { error: "You can only follow artists" },
        { status: 400 }
      );
    }

    // Check if follow relationship exists
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId,
          followingId: paramsValidation.data.id,
        },
      },
    });

    let followed: boolean;

    if (existingFollow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId,
            followingId: paramsValidation.data.id,
          },
        },
      });
      followed = false;
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId,
          followingId: paramsValidation.data.id,
        },
      });
      followed = true;
    }

    const response: FollowResponse = { followed };
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error managing follow:", error);
    
    // Handle Prisma errors
    if (error instanceof Error) {
      if (error.message.includes("P2002")) {
        return NextResponse.json(
          { error: "Follow relationship already exists" },
          { status: 409 }
        );
      }
      
      if (error.message.includes("P2025")) {
        return NextResponse.json(
          { error: "Follow relationship not found" },
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