"use client";

import FollowButton from "@/components/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithArtworksQuestionAndAnswers } from "@/features/post-card/PostCard";
import PostCard from "@/features/post-card/PostCard";
import { getCurrentUser, getUserById, UserFromApi } from "@/lib/users";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

const POSTS_LOADING_COUNT = 3;
const ANIMATION_DURATION = 0.3;
const STAGGER_DELAY = 0.1;

function PostsLoading() {
  return (
    <div
      className="space-y-8 max-w-7xl mx-auto"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">Loading posts...</p>
      {Array.from({ length: POSTS_LOADING_COUNT }).map((_, i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-[200px] w-full rounded-lg"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const containerAnimation = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER_DELAY,
    },
  },
};

const itemAnimation = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

function PostsContainer({
  posts,
}: {
  posts?: PostWithArtworksQuestionAndAnswers[];
}) {
  return (
    <motion.div
      className="space-y-8 max-w-7xl mx-auto"
      variants={containerAnimation}
      initial="hidden"
      animate="show"
      aria-live="polite"
    >
      {posts?.length ? (
        <>
          <h2 className="sr-only">User Posts</h2>
          {posts.map((post) => (
            <motion.div
              key={`post-${post.id}`}
              variants={itemAnimation}
              tabIndex={0}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </>
      ) : (
        <p className="text-center text-gray-500 py-8" role="status">
          No posts to display
        </p>
      )}
    </motion.div>
  );
}

export default function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);

  return (
    <main aria-labelledby="profile-heading">
      <Suspense fallback={<PostsLoading />}>
        <ProfileContent id={id} />
      </Suspense>
    </main>
  );
}

function ProfileContent({ id }: { id: string }) {
  const [user, setUser] = useState<UserFromApi | null>(null);
  const [currentUser, setCurrentUser] = useState<UserFromApi | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [userData, currentUserData] = await Promise.all([
          getUserById(id),
          getCurrentUser(),
        ]);

        if (!userData) {
          notFound();
        }

        setUser(userData);
        setCurrentUser(currentUserData as UserFromApi);
      } catch (err) {
        console.error("Error loading profile:", err);
        setError(
          err instanceof Error ? err : new Error("Failed to load profile data")
        );
      }
    }

    loadData();
  }, [id]);

  if (error) {
    throw error;
  }

  if (!user) {
    return <PostsLoading />;
  }

  return (
    <>
      <section className="mb-8">
        <header className="mb-6">
          <h1 id="profile-heading" className="text-2xl font-bold mb-4">
            {user.firstname}&apos;s Profile
          </h1>
          <p className="sr-only">Profile page for {user.firstname}</p>
        </header>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: ANIMATION_DURATION }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FollowButton user={user} currentUser={currentUser ?? undefined} />
        </motion.div>
      </section>

      <section aria-labelledby="user-posts-heading">
        <h2 id="user-posts-heading" className="sr-only">
          User Posts
        </h2>
        <PostsContainer posts={user.posts} />
      </section>
    </>
  );
}
