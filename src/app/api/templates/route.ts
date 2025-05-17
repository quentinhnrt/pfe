import {auth} from "@/lib/auth";
import prisma from "@/lib/prisma";
import {headers} from "next/headers";
import {NextRequest, NextResponse} from "next/server";

type POST_TYPE = {
    data: object;
    templateId: number;
    active?: boolean;
};

type PUT_TYPE = {
    data: object;
    templateId: number;
    active?: boolean;
    userTemplateId: number;
}

export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user || session.user.role !== "ARTIST") {
            return NextResponse.json({error: "Not authorized"}, {status: 403});
        }

        const {data, templateId, active}: POST_TYPE = await request.json();

        if (!data || !templateId) {
            return NextResponse.json(
                {error: "Missing data or templateId"},
                {status: 400}
            );
        }

        const newUserTemplate = await prisma.userTemplate.create({
            data: {
                userId: session.user.id,
                templateId: templateId,
                data: data,
                active: active ?? false,
            },
        });

        return NextResponse.json(
            {
                success: true,
                userTemplateId: newUserTemplate.id,
            },
            {status: 201}
        );
    } catch (error) {
        console.error("Erreur dans POST /template", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        if (!session || !session.user || session.user.role !== "ARTIST") {
            return NextResponse.json({error: "Not authorized"}, {status: 403});
        }

        const {data, templateId, active}: PUT_TYPE = await request.json();

        if (!data || !templateId) {
            return NextResponse.json(
                {error: "Missing data or templateId"},
                {status: 400}
            );
        }

        const existingUserTemplate = await prisma.userTemplate.findUnique({
            where: {
                userId_templateId: {
                    userId: session.user.id,
                    templateId: templateId,
                }
            },
        });

        if (!existingUserTemplate) {
            return NextResponse.json(
                {error: "User template not found"},
                {status: 404}
            );
        }

        const updatedUserTemplate = await prisma.userTemplate.update({
            where: {
                id: existingUserTemplate.id,
            },
            data: {
                data: data,
                active: active ?? false,
            },
        });

        return NextResponse.json(
            {
                success: true,
                userTemplateId: updatedUserTemplate.id,
            },
            {status: 200}
        );
    } catch (error) {
        console.error("Erreur dans PUT /template", error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        );
    }
}