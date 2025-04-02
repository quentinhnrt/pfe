import prisma from "@/lib/prisma";

export async function GET(request: Request, {params}: { params: Promise<{ id: number }> }) {
    const {id} = await params;

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) {
        return new Response('User not found', {
            status: 403
        })
    }

    return Response.json(user)
}

export async function POST(request: Request, {params}: { params: Promise<{ id: number }> }) {
    const {id} = await params;

    const user = await prisma.user.findUnique({
        where: {
            id
        }
    })

    if (!user) {
        return new Response('User not found', {
            status: 403
        })
    }

    console.log(await request.json())
}