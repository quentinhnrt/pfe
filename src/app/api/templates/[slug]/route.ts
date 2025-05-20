import prisma from "@/lib/prisma";
import {NextResponse} from "next/server";

export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const { slug } = params;

    const template = await prisma.template.findUnique({
        where: {
            slug: slug,
        },
    })

    if (!template) {
        return new Response("Template not found", { status: 404 });
    }

    return NextResponse.json(template)
}