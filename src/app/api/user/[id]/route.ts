import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { uploadImage } from "@/lib/upload/blob";
import { Role } from "@prisma/client";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type UserPrismaQuery = {
  where: {
    id: string;
  };
  data: {
    firstname?: string;
    lastname?: string;
    role?: Role;
    image?: string;
    onBoarded?: boolean;
    bio?: string;
    location?: string;
    website?: string;
    bannerImage?: string;
  };
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: {
      id,
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
      },
      followers: true,
      following: true,
      user_template: {
        where: {
          active: true,
        },
        include: {
          template: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json("User not found", {
      status: 403,
    });
  }

  return NextResponse.json(user);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user?.id !== id) {
    return NextResponse.json("Not authorized", {
      status: 403,
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id,
    },
  });

  if (!user) {
    return NextResponse.json("User not found", {
      status: 403,
    });
  }

  const data = await request.formData();

  const query: UserPrismaQuery = {
    where: {
      id,
    },
    data: {
      firstname: data.get("firstname") as string,
      lastname: data.get("lastname") as string,
      role: data.get("role") as Role,
      onBoarded: true,
      bio: data.get("bio") as string,
      location: data.get("location") as string,
      website: data.get("website") as string,
    },
  };

  const image = data.get("image")
    ? await uploadImage(data.get("image") as File)
    : null;
  const bannerImage = data.get("bannerImage")
    ? await uploadImage(data.get("bannerImage") as File)
    : null;

  if (image) {
    query.data.image = image.url;
  }

  if (bannerImage) {
    query.data.bannerImage = bannerImage.url;
  }

  const updatedUser = await prisma.user.update(query);

  return NextResponse.json(updatedUser, { status: 201 });
}
