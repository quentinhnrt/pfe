import { auth } from "@/shared/lib/auth";
import prisma from "@/shared/lib/prisma";
import { uploadImage } from "@/shared/lib/upload/blob";
import { Artwork } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
      thumbnail: image.url,
      userId: session.user.id,
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

    dataObject.thumbnail = image.url;
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
