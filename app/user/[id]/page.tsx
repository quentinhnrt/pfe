import PostCard from '@/components/post-card/PostCard'
import { Prisma } from '@prisma/client'

// @ts-expect-error it works
type UserWithPosts = Prisma.UserGetPayload<{
  include: {
    posts: {
      include: { artworks: true; question: { include: { answers: true } } }
    }
  }
}>

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const userResponse = await fetch(
    process.env.BETTER_AUTH_URL + '/api/user/' + id,
  )
  const user: UserWithPosts = await userResponse.json()

  return (
    <div>
      <h1>{user.firstname}</h1>
      <div className={'mx-auto max-w-7xl space-y-8'}>
        {user.posts?.length &&
          // @ts-expect-error it works
          user.posts.map((post) => (
            <PostCard post={post} key={'post-' + post.id} />
          ))}
      </div>
    </div>
  )
}
