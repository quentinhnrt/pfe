import {auth} from "@/lib/auth";
import {headers} from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "ARTIST") {
        return NextResponse.json("Not authorized", {
            status: 403,
        });
    }

    const artworkId = parseInt(params.id);

    if (!artworkId) {
        return NextResponse.json("Invalid artwork ID", {
            status: 400,
        });
    }

    const artwork = await prisma.artwork.findUnique({
        where: {
            id: artworkId,
            userId: session.user.id,
        },
    });

    if (!artwork) {
        return NextResponse.json("Artwork not found", {
            status: 404,
        });
    }

    await prisma.artwork.delete({
        where: {
            id: artworkId,
        },
    });

    return NextResponse.json({ message: "Artwork deleted successfully" }, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}