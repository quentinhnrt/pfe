import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

type POST_PARAMS = {
  artworks: number[];
  content: string;
  question?: string;
  answers?: string[];
};

type PUT_PARAMS = {
  postId: number;
  artworks: number[];
  content: string;
};

type CREATE_POST_QUERY = {
  data: {
    userId: string;
    content: string;
    artworks: {
      connect: { id: number }[];
    };
    createdAt: Date;
    updatedAt: Date;
  };
  include: {
    artworks: true;
    question?: {
      include: {
        answers: true;
      };
    };
  };
};

export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "ARTIST") {
      return new Response("Not authorized", {
        status: 403,
      });
    }

    const data: POST_PARAMS = await request.json();

    const content = data.content.toString();
    const artworks = data.artworks.map((id) => {
      return { id };
    });

    const query: CREATE_POST_QUERY = {
      data: {
        userId: session.user.id,
        content,
        artworks: {
          connect: artworks,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        artworks: true,
      },
    };

    const post = await prisma.post.create(query);

    if (data.question && data.answers) {
      post.question = await prisma.question.create({
        data: {
          question: data.question,
          answers: {
            create: data.answers.map((answer) => ({ content: answer })),
          },
          postId: post.id,
        },
        include: {
          answers: true,
        },
      });
    }

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user || session.user.role !== "ARTIST") {
      return new Response("Not authorized", {
        status: 403,
      });
    }

    const data: PUT_PARAMS = await request.json();

    const content = data.content.toString();
    const artworks = data.artworks.map((id) => {
      return { id };
    });

    const post = await prisma.post.update({
      where: {
        id: data.postId,
      },
      data: {
        content,
        artworks: {
          set: artworks,
        },
        updatedAt: new Date(),
      },
      include: {
        artworks: true,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du post:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
