import { Prisma } from '@prisma/client'

// @ts-expect-error it works
type UserWithTemplate = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: {
        artworks: true
        question: {
          include: {
            answers: true
          }
        }
      }
    }
    user_template: {
      where: {
        active: true
      }
      include: {
        template: true
      }
    }
  }
}>
export default function Render({
  user,
  data,
}: {
  user: UserWithTemplate
  data: object
}) {
  return (
    <div>
      <h1>{user.firstname}</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
