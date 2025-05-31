import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

type UserTemplateQuery = {
  where: {
    userId: string;
    active?: boolean;
  };
  include: {
    template: true;
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const searchParams = request.nextUrl.searchParams;

  const query: UserTemplateQuery = {
    where: {
      userId: id,
    },
    include: {
      template: true,
    },
  };

  if (searchParams.has("active")) {
    query.where.active = searchParams.get("active") === "true";
  }

  const templates = await prisma.userTemplate.findMany(query);

  return NextResponse.json(templates);
}
