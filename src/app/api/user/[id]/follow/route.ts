import prisma from "@/lib/prisma";
import {NextRequest, NextResponse} from "next/server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { followerId } = await request.json();
    const { id: followingId } = await params;

    if (followerId === followingId) {
        return NextResponse.json(
            { error: "Vous ne pouvez pas vous suivre vous-même." },
            { status: 400 }
        );
    }

    const [follower, following] = await Promise.all([
        prisma.user.findUnique({ where: { id: followerId } }),
        prisma.user.findUnique({ where: { id: followingId } }),
    ]);

    if (!follower || !following) {
        return NextResponse.json(
            { error: "Utilisateur non trouvé." },
            { status: 404 }
        );
    }

    if (following.role !== "ARTIST") {
        return NextResponse.json(
            { error: "Vous ne pouvez suivre que des artistes." },
            { status: 400 }
        );
    }

    const existingFollow = await prisma.follow.findUnique({
        where: {
            followerId_followingId: {
                followerId,
                followingId,
            },
        },
    });

    if (existingFollow) {
        await prisma.follow.delete({
            where: {
                followerId_followingId: {
                    followerId,
                    followingId,
                },
            },
        });

        return NextResponse.json(
            { followed: false },
            { status: 200 }
        )
    } else {
        await prisma.follow.create({
            data: {
                followerId,
                followingId,
            },
        });

        return NextResponse.json(
            { followed: true },
            { status: 200 }
        )
    }
}