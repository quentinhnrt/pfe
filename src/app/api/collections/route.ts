import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const collectionIds = req.nextUrl.searchParams.get("collectionIds");
  const userId = req.nextUrl.searchParams.get("userId");

  if (!collectionIds || !userId) {
    return NextResponse.json(
      { error: "Missing collectionIds" },
      {
        status: 400,
      }
    );
  }

  const collections = await prisma.collection.findMany({
    where: {
      id: {
        in: collectionIds.split(",").map((id) => parseInt(id)),
      },
      userId: userId,
    },
    include: {
      artworks: true,
    },
  });

  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ARTIST") {
    return NextResponse.json(
      { error: "Not authorized" },
      {
        status: 403,
      }
    );
  }

  const { title, description, artworks } = await req.json();

  const collection = await prisma.collection.create({
    data: {
      title,
      description,
      user: {
        connect: { id: session.user.id },
      },
      artworks: {
        connect: artworks.map((id: number) => ({ id })),
      },
    },
  });

  return NextResponse.json(collection);
}
