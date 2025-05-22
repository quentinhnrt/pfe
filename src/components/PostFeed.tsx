'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import PostCard, { PostWithArtworksQuestionAndAnswers } from '@/features/post-card/PostCard';

type ApiResponse = {
  posts: PostWithArtworksQuestionAndAnswers[];
  nextCursor: number | null;
};

export default function PostFeed() {
  const [posts, setPosts] = useState<PostWithArtworksQuestionAndAnswers[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement>(null);

  const fetchPosts = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/feed?limit=10${nextCursor ? `&cursor=${nextCursor}` : ''}`);
      const data: ApiResponse = await res.json();

      setPosts((prev) => {
        const newPosts = data.posts.filter((p) => !prev.find((existing) => existing.id === p.id));
        return [...prev, ...newPosts];
      });

      if (data.nextCursor) {
        setNextCursor(data.nextCursor);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des posts:', error);
    } finally {
      setLoading(false);
    }
  }, [nextCursor, loading, hasMore]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    const element = observerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) {
        fetchPosts();
      }
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [fetchPosts, loading, hasMore]);

  return (
    <section className="py-10">
      <div className="container mx-auto px-4 text-black">
        <h2 className="text-2xl text-white font-bold mb-6">Explorez les créations</h2>
        <div className="flex flex-col gap-6 items-center">
          {posts.map((post) => (
            <div key={post.id} className="w-[1000px]">
              <PostCard post={post} />
            </div>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mt-8">
            <div className="loader h-10 w-10 rounded-full border-4 border-gray-600 border-t-black animate-spin"></div>
          </div>
        )}

        <div ref={observerRef} className="h-10" />
      </div>
    </section>
  );
}
