import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type GetParams = {
  artworks: number[];
  perPage: number;
  page: number;
  title: string;
};

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user) {
    return NextResponse.json("Not authorized", { status: 403 });
  }

  const data = request.nextUrl.searchParams;

  const params: GetParams = {
    artworks: (data.get("artworks") ?? "")
      .split(",")
      .filter(Boolean)
      .map(Number),
    perPage: Number(data.get("perPage") ?? 10),
    page: Number(data.get("page") ?? 1),
    title: data.get("title") ?? "",
  };

  const artworks = await prisma.artwork.findMany({
    take: params.perPage,
    skip: params.page * params.perPage,
    where: {
      userId: session.user.id,
      NOT: {
        id: {
          in: params.artworks,
        },
      },
      title: {
        contains: params.title,
        mode: "insensitive",
      },
    },
  });

  const initialArtworks = await prisma.artwork.findMany({
    where: {
      userId: session.user.id,
      id: {
        in: params.artworks,
      },
    },
  });

  return NextResponse.json({ artworks, initialArtworks }, { status: 201 });
}
