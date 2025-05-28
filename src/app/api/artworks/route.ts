import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/upload/blob";
import { headers } from "next/headers";

// Validation schemas
const getArtworksSchema = z.object({
  userId: z.string().nullable().optional(),
  page: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 1),
  limit: z.string().nullable().optional().transform((val) => val ? parseInt(val, 10) : 10),
  isForSale: z.string().nullable().optional(),
});

const createArtworkSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  isForSale: z.enum(["true", "false"]).transform((val) => val === "true"),
  price: z.coerce.number().int().positive().optional().nullable(),
});

const updateArtworkSchema = z.object({
  artworkId: z.coerce.number().int().positive(),
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  isForSale: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
  price: z.coerce.number().int().positive().optional().nullable(),
  sold: z.enum(["true", "false"]).transform((val) => val === "true").optional(),
});


export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const validation = getArtworksSchema.safeParse({
      userId: searchParams.get("userId"),
      page: searchParams.get("page"),
      limit: searchParams.get("limit"),
      isForSale: searchParams.get("isForSale"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid parameters", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { userId, page, limit, isForSale } = validation.data;

    const query: Prisma.ArtworkFindManyArgs = {
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            firstname: true,
            lastname: true,
          },
        },
      },
    };

    // Build where clause
    const where: Prisma.ArtworkWhereInput = {};
    if (userId) {
      where.userId = userId;
    }
    if (isForSale === "true") {
      where.isForSale = true;
      where.sold = false;
    }
    if (Object.keys(where).length > 0) {
      query.where = where;
    }

    // Add pagination
    if (page && page > 0) {
      query.skip = (page - 1) * limit;
      query.take = limit;
    }

    const artworks = await prisma.artwork.findMany(query);

    return NextResponse.json(artworks);
  } catch (error) {
    console.error("Error fetching artworks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can create artworks" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Validate form data
    const validation = createArtworkSchema.safeParse({
      title: formData.get("title"),
      description: formData.get("description"),
      isForSale: formData.get("isForSale"),
      price: formData.get("price"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { title, description, isForSale, price } = validation.data;

    // Handle image upload
    const imageFile = formData.get("image");
    if (!imageFile || !(imageFile instanceof File)) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const uploadedImage = await uploadImage(imageFile);
    if (!uploadedImage?.url) {
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const artwork = await prisma.artwork.create({
      data: {
        title,
        description: description || "",
        isForSale,
        price: isForSale && price ? price : null,
        thumbnail: uploadedImage.url,
        userId: session.user.id,
        sold: false,
      },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    console.error("Error creating artwork:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.role !== "ARTIST") {
      return NextResponse.json(
        { error: "Unauthorized: Only artists can update artworks" },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    
    // Validate form data
    const validation = updateArtworkSchema.safeParse({
      artworkId: formData.get("artworkId"),
      title: formData.get("title"),
      description: formData.get("description"),
      isForSale: formData.get("isForSale"),
      price: formData.get("price"),
      sold: formData.get("sold"),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const { artworkId, ...updateData } = validation.data;

    // Check if artwork exists and belongs to user
    const artwork = await prisma.artwork.findFirst({
      where: {
        id: artworkId,
        userId: session.user.id,
      },
    });

    if (!artwork) {
      return NextResponse.json(
        { error: "Artwork not found or unauthorized" },
        { status: 404 }
      );
    }

    // Build update data
    const dataToUpdate: Prisma.ArtworkUpdateInput = {};
    
    if (updateData.title !== undefined) {
      dataToUpdate.title = updateData.title;
    }
    if (updateData.description !== undefined) {
      dataToUpdate.description = updateData.description;
    }
    if (updateData.isForSale !== undefined) {
      dataToUpdate.isForSale = updateData.isForSale;
    }
    if (updateData.price !== undefined) {
      dataToUpdate.price = updateData.price;
    }
    if (updateData.sold !== undefined) {
      dataToUpdate.sold = updateData.sold;
    }

    // Handle image upload if provided
    const imageFile = formData.get("image");
    if (imageFile && imageFile instanceof File) {
      const uploadedImage = await uploadImage(imageFile);
      if (uploadedImage?.url) {
        dataToUpdate.thumbnail = uploadedImage.url;
      }
    }

    const updatedArtwork = await prisma.artwork.update({
      where: {
        id: artworkId,
      },
      data: dataToUpdate,
    });

    return NextResponse.json(updatedArtwork);
  } catch (error) {
    console.error("Error updating artwork:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}