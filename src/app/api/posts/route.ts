import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import {NextRequest, NextResponse} from "next/server";

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

type GET_POST_QUERY = {
    orderBy: {
        createdAt: "desc";
    };
    include: {
        artworks: true;
        question: {
        include: {
            answers: true;
        };
        };
    };
    take: number;
    skip: number;
    where?: {
        userId?: string;
    };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = searchParams.get("limit") || "10";
  const page = searchParams.get("page") || "1";
  const userId = searchParams.get("userId");

  const query: GET_POST_QUERY = {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      artworks: true,
      question: {
        include: {
          answers: true,
        },
      },
    },
    take: Number(limit),
    skip: (Number(page) - 1) * Number(limit),
  }

    if (userId) {
        query.where = {
        userId: userId,
        };
    }

  const posts = await prisma.post.findMany(query)

    return NextResponse.json(posts, {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}

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
