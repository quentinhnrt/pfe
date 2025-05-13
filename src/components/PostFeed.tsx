'use client';

import {useEffect, useRef, useState, useCallback} from 'react';
import PostCard, {PostWithArtworksQuestionAndAnswers} from "@/features/post-card/PostCard";

type ApiResponse = {
    posts: PostWithArtworksQuestionAndAnswers[];
    nextCursor: number | null;
};

export default function PostFeed() {
    const [posts, setPosts] = useState<PostWithArtworksQuestionAndAnswers[]>([]);
    const [loading, setLoading] = useState(false);
    const [nextCursor, setNextCursor] = useState<number | null>(null);
    const observerRef = useRef<HTMLDivElement>(null);

    const fetchPosts = useCallback(async () => {
        if (loading) return;
        setLoading(true);

        const res = await fetch(`/api/feed?limit=10${nextCursor ? `&cursor=${nextCursor}` : ''}`);
        const data: ApiResponse = await res.json();

        setPosts(prev => [...prev, ...data.posts]);
        setNextCursor(data.nextCursor);
        setLoading(false);
    }, [nextCursor, loading]);

    useEffect(() => {
        fetchPosts();
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && nextCursor !== null && !loading) {
                fetchPosts();
            }
        });

        if (observerRef.current) {
            observer.observe(observerRef.current);
        }

        return () => {
            if (observerRef.current) {
                observer.unobserve(observerRef.current);
            }
        };
    }, [fetchPosts, nextCursor, loading]);

    return (
        <div className="space-y-6">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}

            {loading && <p className="text-center text-gray-500">Chargement...</p>}

            <div ref={observerRef} className="h-10" />
        </div>
    );
}
