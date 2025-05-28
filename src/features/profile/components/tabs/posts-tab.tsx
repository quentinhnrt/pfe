"use client";

import { Button } from "@/components/ui/shadcn/button";
import PostCard, {
  PostWithArtworksQuestionAndAnswers,
} from "@/features/post-card/components/post-card";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";

export default function PostsTab({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [posts, setPosts] = useState<PostWithArtworksQuestionAndAnswers[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const { data: session } = authClient.useSession();

  const limit = 10;

  const fetchPosts = async () => {
    try {
      setIsLoading(true);

      const response = await fetch(
        `/api/posts?userId=${userId}&page=${page}&limit=${limit}&currentUserId=${session?.user?.id || ""}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const result: PostWithArtworksQuestionAndAnswers[] =
        await response.json();

      if (page === 1) {
        setPosts(result);
      } else {
        setPosts((prev) => [...prev, ...result]);
      }

      setHasMore(result.length !== 0);
      if (!hasFetched) {
        setHasFetched(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!hasFetched || !isActive) return;
    fetchPosts();
  }, [page, limit]);

  useEffect(() => {
    if (!isActive || hasFetched) return;
    fetchPosts();
  }, [isActive, userId]);

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Posts</h2>
        <div className="text-red-500">
          Erreur lors du chargement des posts: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {isLoading && page === 1 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-gray-200 rounded animate-pulse dark:bg-gray-700"
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className={"mx-auto w-fit space-y-4"}>
            {posts?.map((post) => <PostCard post={post} key={post.id} />)}
          </div>

          {posts?.length === 0 && (
            <p className="text-gray-500">No posts found</p>
          )}

          {hasMore && (
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading}
              className="cursor-pointer mx-auto block mt-4"
            >
              {isLoading ? "Loading..." : "Load more"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
