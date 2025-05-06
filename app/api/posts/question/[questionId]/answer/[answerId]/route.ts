import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ answerId: string }> },
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    return new Response('Not authorized', {
      status: 403,
    })
  }

  const { answerId } = await params
  const data = await request.json()

  const userAlreadyAnswered = await prisma.answer.findFirst({
    where: {
      users: {
        some: {
          id: session.user.id,
        },
      },
      questionId: parseInt(data.questionId),
    },
  })

  if (userAlreadyAnswered) {
    return new Response('Already answered', {
      status: 403,
    })
  }

  const updateAnswer = await prisma.answer.update({
    where: {
      id: parseInt(answerId),
    },
    data: {
      votes: {
        increment: 1,
      },
      users: {
        connect: {
          id: session.user.id,
        },
      },
    },
  })

  if (!updateAnswer) {
    return new Response('Error', {
      status: 500,
    })
  }

  return NextResponse.json(updateAnswer)
}
