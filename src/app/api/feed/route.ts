import {NextRequest, NextResponse} from "next/server";
import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {headers} from "next/headers";

export async function GET(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user) {
        return new Response("Not authorized", {
            status: 401,
        });
    }

    const currentUserId = session.user.id;
    const { searchParams } = new URL(req.url);

    const limit = parseInt(searchParams.get("limit") ?? "10", 10);
    const cursor = searchParams.get("cursor"); // ID du dernier post chargé

    const followedUsers = await prisma.follow.findMany({
        where: {
            followerId: currentUserId,
        },
        select: {
            followingId: true,
        },
    });

    const followedUserIds = followedUsers.map(f => f.followingId);

    followedUserIds.push(currentUserId)

    const posts = await prisma.post.findMany({
        where: {
            userId: {
                in: followedUserIds,
            },
        },
        take: limit + 1,
        ...(cursor && {
            cursor: { id: parseInt(cursor, 10) },
            skip: 1,
        }),
        orderBy: {
            createdAt: "desc",
        },
        include: {
            user: true,
            question: {
                include: {
                    answers: true,
                },
            },
            artworks: true,
            PostReaction: {
                include: {
                    reaction: true,
                    user: true,
                },
            },
        },
    });

    let nextCursor: number | null = null;
    if (posts.length > limit) {
        const nextItem = posts.pop();
        nextCursor = nextItem!.id;
    }

    return NextResponse.json({
        posts,
        nextCursor,
    });
}
