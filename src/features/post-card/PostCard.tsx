import Image from "next/image";
import PostArtworks from "@/features/post-card/PostArtworks";
import PostCommunityQuestion from "@/features/post-card/PostCommunityQuestion";
import { Prisma } from "@prisma/client";

export type PostWithArtworksQuestionAndAnswers = Prisma.PostGetPayload<{
  include: {
    user: true;
    artworks: true;
    question: { include: { answers: true; user: true } };
  };
}>;

type Props = {
  post: PostWithArtworksQuestionAndAnswers;
};

export default function PostCard({ post }: Props) {
  return (
    <div className="p-8 w-[1000px] rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 backdrop-blur-sm bg-white/90">
      <div className="flex items-center gap-2 text-xl text-black mb-4">
        <Image
          className="rounded-full"
          src={post.user.image ?? "/default-avatar.png"}
          alt={`${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`}
          width={48}
          height={48}
        />
        <div>
          <div className="flex gap-1 items-center">
            <p className="mr-[1px] ml-[2px]">{post.user.firstname ?? ""}</p>
            <p>{post.user.lastname ?? ""}</p>
          </div>
          <p className="text-gray-600 text-sm">
            {new Date(post.user.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
      </div>
      <p className="text-xl text-gray-800 leading-relaxed mb-5">{post.content}</p>
      {post.artworks && <PostArtworks artworks={post.artworks} />}
      {post.question && <PostCommunityQuestion question={post.question} />}
    </div>
  );
}
