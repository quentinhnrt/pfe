import PostArtworks from "@/features/post-card/PostArtworks";
import PostCommunityQuestion from "@/features/post-card/PostCommunityQuestion";
import { Prisma } from "@prisma/client";

export type PostWithArtworksQuestionAndAnswers = Prisma.PostGetPayload<{
  include: { artworks: true; question: { include: { answers: true } } };
}>;

type Props = {
  post: PostWithArtworksQuestionAndAnswers;
};
export default function PostCard({ post }: Props) {
  return (
    <div className={"rounded-xl border border-gray-300 bg-white p-4 shadow-xl"}>
      <p>{post.content}</p>
      {post.artworks && <PostArtworks artworks={post.artworks} />}
      {post.question && <PostCommunityQuestion question={post.question} />}
    </div>
  );
}
