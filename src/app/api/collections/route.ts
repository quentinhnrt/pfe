import {NextRequest, NextResponse} from "next/server";
import prisma from "@/lib/prisma";
import {auth} from "@/lib/auth";
import {headers} from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "ARTIST") {
        return NextResponse.json(
            {error: "Not authorized"},
            {
                status: 403,
            }
        );
    }

    const {title, description, artworks} = await req.json();

    const collection = await prisma.collection.create({
        data: {
            title,
            description,
            user: {
                connect: {id: session.user.id}
            },
            artworks: {
                connect: artworks.map((id: number) => ({id}))
            }
        }
    })

    return NextResponse.json(collection);
}