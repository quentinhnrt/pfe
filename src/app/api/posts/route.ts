import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

// Validation schemas
const getPostsSchema = z.object({
  limit: z.string().nullable().optional().transform((val) => {
    if (!val) return 10;
    const num = parseInt(val, 10);
    return isNaN(num) ? 10 : Math.min(Math.max(num, 1), 100);
  }),
  page: z.string().nullable().optional().transform((val) => {
    if (!val) return 1;
    const num = parseInt(val, 10);
    return isNaN(num) ? 1 : Math.max(num, 1);
  }),
  userId: z.string().nullable().optional(),
});

const createPostSchema = z.object({
  content: z.string().min(1).max(5000),
  artworks: z.array(z.number().int().positive()).min(1),
  question: z.string().min(1).max(500).optional(),
  answers: z.array(z.string().min(1).max(200)).optional(),
});

const updatePostSchema = z.object({
  postId: z.number().int().positive(),
  content: z.string().min(1).max(5000),
  artworks: z.array(z.number().int().positive()).min(1),
});


export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const searchParams = request.nextUrl.searchParams;
    const validation = getPostsSchema.safeParse({
      limit: searchParams.get("limit"),
      page: searchParams.get("page"),
      userId: searchParams.get("userId"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { limit, page, userId } = validation.data;
    const currentUserId = session?.user?.id || "";

    const query: Prisma.PostFindManyArgs = {
      orderBy: {
        createdAt: "desc",
      },
      include: {
        artworks: true,
        question: {
          include: {
            answers: {
              include: {
                users: {
                  where: {
                    id: currentUserId,
                  },
                },
              },
            },
          },
        },
        user: true,
      },
      take: limit,
      skip: (page - 1) * limit,
    };

    if (userId) {
      query.where = {
        userId: userId,
      };
    }

    const posts = await prisma.post.findMany(query);

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
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
        { error: "Unauthorized: Only artists can create posts" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = createPostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { content, artworks, question, answers } = validation.data;

    // Validate question and answers together
    if ((question && !answers) || (!question && answers)) {
      return NextResponse.json(
        { error: "Both question and answers must be provided together" },
        { status: 400 }
      );
    }

    if (answers && answers.length < 2) {
      return NextResponse.json(
        { error: "At least 2 answers are required for a question" },
        { status: 400 }
      );
    }

    // Verify that all artworks exist and belong to the user
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

    // Create post with transaction
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.post.create({
        data: {
          userId: session.user!.id,
          content,
          artworks: {
            connect: artworks.map((id) => ({ id })),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          artworks: true,
          question: {
            include: {
              answers: true,
            },
          },
        },
      });

      // Create question if provided
      if (question && answers) {
        await tx.question.create({
          data: {
            question,
            answers: {
              create: answers.map((answer) => ({ content: answer })),
            },
            postId: newPost.id,
          },
        });

        // Fetch the post again with question included
        return await tx.post.findUnique({
          where: { id: newPost.id },
          include: {
            artworks: true,
            question: {
              include: {
                answers: true,
              },
            },
          },
        });
      }

      return newPost;
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Error creating post:", error);
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
        { error: "Unauthorized: Only artists can update posts" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const validation = updatePostSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { postId, content, artworks } = validation.data;

    // Check if post exists and belongs to user
    const existingPost = await prisma.post.findFirst({
      where: {
        id: postId,
        userId: session.user.id,
      },
    });

    if (!existingPost) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    // Verify that all artworks exist and belong to the user
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

    // Update post
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        content,
        artworks: {
          set: artworks.map((id) => ({ id })),
        },
        updatedAt: new Date(),
      },
      include: {
        artworks: true,
        question: {
          include: {
            answers: true,
          },
        },
      },
    });

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}