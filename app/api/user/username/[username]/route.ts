import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: {
      name: username,
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
      user_template: {
        where: {
          active: true,
        },
        include: {
          template: true,
        },
      },
    },
  })

  if (!user) {
    return new Response('User not found', { status: 404 })
  }

  return NextResponse.json(user, {
    status: 200,
  })
}
