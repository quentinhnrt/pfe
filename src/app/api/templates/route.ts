import { NextResponse } from "next/server";
import { auth } from "@/shared/lib/auth";
import { headers } from "next/headers";
import prisma from "@/shared/lib/prisma";

type POST_TYPE = {
    data: object
    templateId: number,
    active?: boolean
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })

        if (!session || !session.user || session.user.role !== "ARTIST") {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const { data, templateId, active }: POST_TYPE = await request.json();

        if (!data || !templateId) {
            return NextResponse.json({ error: "Missing data or templateId" }, { status: 400 });
        }

        const newUserTemplate = await prisma.userTemplate.create({
            data: {
                userId: session.user.id,
                templateId: templateId,
                data: data,
                active: active ?? false,
            }
        })

        return NextResponse.json({
            success: true,
            userTemplateId: newUserTemplate.id,
        }, { status: 201 });

    } catch (error) {
        console.error("Erreur dans POST /template", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
