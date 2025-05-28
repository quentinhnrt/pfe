import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Role, Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/upload/blob";
import { headers } from "next/headers";

// Validation schemas
const paramsSchema = z.object({
  id: z.string(),
});

const updateUserSchema = z.object({
  firstname: z.string().min(1).max(100).optional(),
  lastname: z.string().min(1).max(100).optional(),
  role: z.nativeEnum(Role).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
  website: z.string().url().optional().or(z.literal("")),
});

// Types
type RouteParams = {
  params: { id: string };
};


export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Validate params
    const validation = paramsSchema.safeParse({ id });

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid user ID", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        id: validation.data.id,
      },
      include: {
        posts: {
          include: {
            artworks: true,
            question: {
              include: {
                answers: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = params;

    // Validate params
    const paramsValidation = paramsSchema.safeParse({ id });

    if (!paramsValidation.success) {
      return NextResponse.json(
        { error: "Invalid user ID", details: paramsValidation.error.flatten() },
        { status: 400 }
      );
    }

    // Check authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user || session.user.id !== paramsValidation.data.id) {
      return NextResponse.json(
        { error: "Unauthorized: You can only update your own profile" },
        { status: 403 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id: paramsValidation.data.id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    
    // Extract and validate text fields
    const textData = {
      firstname: formData.get("firstname") as string,
      lastname: formData.get("lastname") as string,
      role: formData.get("role") as Role,
      bio: formData.get("bio") as string,
      location: formData.get("location") as string,
      website: formData.get("website") as string,
    };

    // Remove null/undefined values
    const cleanedData = Object.fromEntries(
      Object.entries(textData).filter(([, value]) => value !== null && value !== undefined)
    );

    const validation = updateUserSchema.safeParse(cleanedData);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validation.error.flatten() },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Prisma.UserUpdateInput = {
      ...validation.data,
      onBoarded: true,
    };

    // Handle image uploads
    const imageFile = formData.get("image");
    const bannerImageFile = formData.get("bannerImage");

    if (imageFile && imageFile instanceof File) {
      const uploadedImage = await uploadImage(imageFile);
      if (uploadedImage?.url) {
        updateData.image = uploadedImage.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload profile image" },
          { status: 500 }
        );
      }
    }

    if (bannerImageFile && bannerImageFile instanceof File) {
      const uploadedBannerImage = await uploadImage(bannerImageFile);
      if (uploadedBannerImage?.url) {
        updateData.bannerImage = uploadedBannerImage.url;
      } else {
        return NextResponse.json(
          { error: "Failed to upload banner image" },
          { status: 500 }
        );
      }
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: {
        id: paramsValidation.data.id,
      },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstname: true,
        lastname: true,
        name: true,
        role: true,
        image: true,
        bannerImage: true,
        bio: true,
        location: true,
        website: true,
        onBoarded: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}