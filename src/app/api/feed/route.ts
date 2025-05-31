import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Validation schema
const getFeedSchema = z.object({
  limit: z.string().nullable().optional().transform((val) => {
    if (!val) return 10;
    const num = parseInt(val, 10);
    return isNaN(num) ? 10 : Math.min(Math.max(num, 1), 50);
  }),
  cursor: z.string().nullable().optional(),
});

// Types
type FeedPost = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
    firstname: string | null;
    lastname: string | null;
  };
  question: {
    id: number;
    question: string;
    postId: number;
    answers: Array<{
      id: number;
      content: string;
      questionId: number;
      votes: number;
      users: Array<{ id: string }>;
    }>;
  } | null;
  artworks: Array<{
    id: number;
    title: string;
    thumbnail: string;
  }>;
  PostReaction: Array<{
    id: number;
    reaction: {
      id: number;
      image: string;
    };
    user: {
      id: string;
      name: string | null;
    };
  }>;
};

type FeedResponse = {
  posts: FeedPost[];
  nextCursor: number | null;
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

    const currentUserId = session.user.id;
    const searchParams = request.nextUrl.searchParams;

    // Validate parameters
    const validation = getFeedSchema.safeParse({
      limit: searchParams.get("limit"),
      cursor: searchParams.get("cursor"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { limit, cursor } = validation.data;

    // Get followed users
    const followedUsers = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
      },
      select: {
        followingId: true,
      },
    });

    // Include current user's posts in feed
    const followedUserIds = [
      currentUserId,
      ...followedUsers.map((f) => f.followingId),
    ];

    // Parse cursor if provided
    const cursorOptions = cursor
      ? {
          cursor: { id: parseInt(cursor, 10) },
          skip: 1,
        }
      : {};

    // Validate cursor
    if (cursor && isNaN(parseInt(cursor, 10))) {
      return NextResponse.json(
        { error: "Invalid cursor format" },
        { status: 400 }
      );
    }

    // Fetch posts with pagination
    const posts = await prisma.post.findMany({
      where: {
        userId: {
          in: followedUserIds,
        },
      },
      take: limit + 1, // Fetch one extra to determine if there's a next page
      ...cursorOptions,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            firstname: true,
            lastname: true,
          },
        },
        question: {
          include: {
            answers: {
              include: {
                users: {
                  where: {
                    id: currentUserId,
                  },
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
        artworks: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
        PostReaction: {
          include: {
            reaction: {
              select: {
                id: true,
                image: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // Determine next cursor for pagination
    let nextCursor: number | null = null;
    if (posts.length > limit) {
      const nextItem = posts.pop();
      nextCursor = nextItem!.id;
    }

    const response: FeedResponse = {
      posts,
      nextCursor,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}