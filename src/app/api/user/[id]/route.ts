import prisma from "@/shared/lib/prisma";
import {headers} from "next/headers";
import {auth} from "@/shared/lib/auth";
import {uploadImage} from "@/shared/lib/upload/blob";
import {NextResponse} from "next/server";

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
          artworks: true
        }
      }
    }
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
    headers: await headers()
  })

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

  const data = await request.formData()
  const image = await uploadImage(data.get('image') as File)

  const updatedUser = await prisma.user.update({
    where: {
      id: id
    },
    data: {
      firstname: data.get("firstname"),
      lastname: data.get("lastname"),
      role: data.get("role"),
      image: image.url,
      onBoarded: true
    }
  })

  return NextResponse.json(updatedUser, {status: 201})
}
