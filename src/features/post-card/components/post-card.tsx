import { Card } from "@/components/ui/shadcn/card";
import PostArtworks from "@/features/post-card/components/post-artworks";
import PostCommunityQuestion from "@/features/post-card/components/post-community-question";
import { Prisma } from "@prisma/client";
import { Clock, MoreHorizontal } from "lucide-react";
import Image from "next/image";

export type PostWithArtworksQuestionAndAnswers = Prisma.PostGetPayload<{
  include: {
    user: true;
    artworks: true;
    question: {
      include: { answers: { include: { users: true } }; user: true };
    };
  };
}>;

export type PostInUserFromApi = Prisma.PostGetPayload<{
  include: {
    artworks: true;
    question: { include: { answers: { include: { users: true } } } };
    user: true;
  };
}>;

type Props = {
  post: PostWithArtworksQuestionAndAnswers | PostInUserFromApi;
};

export default function PostCard({ post }: Props) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return "Hier";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <Card className="w-full rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="p-3 sm:p-5 pb-2 sm:pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl overflow-hidden border-2 border-gray-200">
                <Image
                  src={post.user.image ?? "/default-avatar.png"}
                  alt={`${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`}
                  width={48}
                  height={48}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm sm:text-base">
                  {`${post.user.firstname ?? ""} ${post.user.lastname ?? ""}`.trim() ||
                    "Utilisateur"}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm">
                <Clock size={14} />
                <span>{formatDate(new Date(post.user.createdAt))}</span>
              </div>
            </div>
          </div>
          <button className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-2xl hover:bg-gray-100 transition-colors duration-300 group">
            <MoreHorizontal
              size={18}
              className="text-gray-400 group-hover:text-gray-600"
            />
          </button>
        </div>
      </div>
      {post.content && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-4">
          <p className="text-sm sm:text-base leading-relaxed">{post.content}</p>
        </div>
      )}
      {post.artworks && post.artworks.length > 0 && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-4">
          <PostArtworks artworks={post.artworks} />
        </div>
      )}
      {post.question && (
        <div className="px-3 sm:px-5 pb-4 sm:pb-5">
          <PostCommunityQuestion question={post.question} />
        </div>
      )}
    </Card>
  );
}
