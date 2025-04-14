import {auth} from "@/shared/lib/auth";
import {headers} from "next/headers";
import prisma from "@/shared/lib/prisma";
import {NextResponse} from "next/server";

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session.user || session.user.role !== "ARTIST") {
            return new Response("Not authorized", {
                status: 403,
            });
        }

        const data = await request.json()

        const content = data.content.toString()
        const artworks = data.artworks.map(id => {
            return {id}
        })

        console.log(artworks)

        const post = await prisma.post.create({
            data: {
                userId: session.user.id,
                content,
                artworks:  {
                    connect: artworks
                }
            },
            include: {
                artworks: true
            }
        })

        return NextResponse.json(post, {status: 201})
    } catch (error) {
        console.error('Erreur lors de la création du post avec FormData:', error);
        return NextResponse.json({error: 'Erreur interne'}, {status: 500});
    }
}