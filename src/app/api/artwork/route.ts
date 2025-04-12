import {auth} from "@/shared/lib/auth";
import {headers} from "next/headers";
import prisma from "@/shared/lib/prisma";
import {uploadImage} from "@/shared/lib/upload/blob";

export async function POST(
    request: Request
) {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session || !session.user) {
        return new Response("Not authorized", {
            status: 403,
        });
    }

    const data = await request.formData()
    const image = await uploadImage(data.get("image") as File)
    const isForSale = data.get("isForSale") === "true"
    const price = parseInt(data.get("price") as string)

    const artwork = await prisma.artwork.create({
        data: {
            title: data.get("title"),
            description: data.get("description"),
            isForSale,
            price:  Number.isNaN(price) ? null : price,
            thumbnail: image.url,
            userId: session.user.id
        },
    })

    return Response.json(artwork)
}