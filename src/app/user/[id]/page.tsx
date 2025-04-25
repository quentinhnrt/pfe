import {Prisma} from "@prisma/client";
import PostCard from "@/shared/components/post-card/PostCard";

type UserWithPosts = Prisma.UserGetPayload<{
    include: { posts: { include: { artworks: true, question: { include: { answers: true } } } } }
}>

export default async function ProfilePage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params
    const userResponse = await fetch(process.env.BETTER_AUTH_URL + "/api/user/" + id)
    const user: UserWithPosts = await userResponse.json()

    return (
        <div>
            <h1>{user.firstname}</h1>
            <div className={"space-y-8 max-w-7xl mx-auto"}>
                {user.posts?.length && user.posts.map(post => <PostCard post={post} key={"post-" + post.id}/>)}
            </div>
        </div>
    )
}
