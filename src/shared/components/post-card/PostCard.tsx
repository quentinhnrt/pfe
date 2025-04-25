import {Prisma} from "@prisma/client";
import PostArtworks from "@/shared/components/post-card/PostArtworks";
import PostCommunityQuestion from "@/shared/components/post-card/PostCommunityQuestion";

type PostWithArtworksQuestionAndAnswers = Prisma.PostGetPayload<{
    include: { artworks: true, question: { include: { answers: true } } }
}>

type Props = {
    post: PostWithArtworksQuestionAndAnswers
}
export default function PostCard({post}: Props) {
    return (
        <div className={"bg-white shadow-xl rounded-xl border border-gray-300 p-4"}>
            <p>{post.content}</p>
            {post.artworks && <PostArtworks artworks={post.artworks}/>}
            {post.question && <PostCommunityQuestion question={post.question}/>}
        </div>
    )
}