import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/upload/blob";
import { Artwork } from "@prisma/client";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

type PrismaArtworkQuery = {
  where?: {
    userId?: string;
    isForSale?: boolean;
    sold?: boolean;
    OR?: Array<{
      title?: {
        contains: string;
        mode: "insensitive";
      };
      description?: {
        contains: string;
        mode: "insensitive";
      };
    }>;
  };
  orderBy?: {
    createdAt: "asc" | "desc";
  };
  skip?: number;
  take?: number;
  include?: {
    user?: boolean;
  };
};
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const query: PrismaArtworkQuery = {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: true,
    },
  };

  if (searchParams.has("userId")) {
    const userId = searchParams.get("userId") as string;
    query.where = {
      userId,
    };
  }

  if (searchParams.has("search")) {
    const searchTerm = searchParams.get("search") as string;
    query.where = {
      ...query.where,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    };
  }

  if (searchParams.has("page")) {
    const page = parseInt(searchParams.get("page") as string);
    const limit = parseInt(searchParams.get("limit") as string) || 10;

    query.skip = (page - 1) * limit;
    query.take = limit;
  }

  if (searchParams.has("isForSale")) {
    const toBuy = searchParams.get("isForSale") as string;

    if (toBuy === "true") {
      query.where = {
        ...query.where,
        isForSale: true,
        sold: false,
      };
    }
  }

  const artworks = await prisma.artwork.findMany(query);

  return NextResponse.json(artworks);
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ARTIST") {
    return NextResponse.json("Not authorized", {
      status: 403,
    });
  }

  const data = await request.formData();
  const image = await uploadImage(data.get("image") as File);
  const isForSale = data.get("isForSale") === "true";
  const price = parseInt(data.get("price") as string);

  const artwork = await prisma.artwork.create({
    data: {
      title: data.get("title") as string,
      description: data.get("description") as string,
      isForSale,
      price: Number.isNaN(price) ? null : price,
      thumbnail: image?.url || "",
      userId: session.user.id,
      sold: false,
    },
  });

  return NextResponse.json(artwork);
}

export async function PUT(request: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || !session.user || session.user.role !== "ARTIST") {
    return NextResponse.json("Not authorized", {
      status: 403,
    });
  }

  const data = await request.formData();
  const artworkId = parseInt(data.get("artworkId") as string);

  if (!artworkId) {
    return NextResponse.json("Not authorized", {
      status: 403,
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
      status: 403,
    });
  }

  const dataObject = {} as Artwork;

  if (data.has("title")) {
    dataObject.title = data.get("title") as string;
  }

  if (data.has("description")) {
    dataObject.description = data.get("description") as string;
  }

  if (data.has("isForSale")) {
    dataObject.isForSale = data.get("isForSale") === "true";
  }

  if (data.has("price")) {
    dataObject.price = parseInt(data.get("price") as string);
  }

  if (data.has("image") && data.get("image") instanceof File) {
    const image = await uploadImage(data.get("image") as File);

    dataObject.thumbnail = image?.url || "";
  }

  if (data.has("sold")) {
    dataObject.sold = data.get("sold") === "true";
  }

  const updatedArtwork = await prisma.artwork.update({
    where: {
      id: artworkId,
      userId: session.user.id,
    },
    data: dataObject,
  });

  if (!updatedArtwork) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }

  return NextResponse.json(updatedArtwork);
}
