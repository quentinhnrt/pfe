"use client";

import FollowButton from "@/components/FollowButton";
import { Skeleton } from "@/components/ui/skeleton";
import type { PostWithArtworksQuestionAndAnswers } from "@/features/post-card/PostCard";
import PostCard from "@/features/post-card/PostCard";
import { getCurrentUser, getUserById } from "@/lib/users";
import { motion } from "motion/react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// Loading component for posts
function PostsLoading() {
  return (
    <div
      className="space-y-8 max-w-7xl mx-auto"
      aria-live="polite"
      aria-busy="true"
    >
      <p className="sr-only">Loading posts...</p>
      {[1, 2, 3].map((i) => (
        <Skeleton
          key={`skeleton-${i}`}
          className="h-[200px] w-full rounded-lg"
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

// Animated container for posts
function PostsContainer({
  posts,
}: {
  posts?: PostWithArtworksQuestionAndAnswers[];
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      className="space-y-8 max-w-7xl mx-auto"
      variants={container}
      initial="hidden"
      animate="show"
      aria-live="polite"
    >
      {posts && posts.length > 0 ? (
        <>
          <h2 className="sr-only">User Posts</h2>
          {posts.map((post) => (
            <motion.div key={`post-${post.id}`} variants={item} tabIndex={0}>
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

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  // Try/catch block for error handling
  try {
    const userPromise = getUserById(id);
    const currentUserPromise = getCurrentUser();

    // Await both promises to handle potential errors
    const [user, currentUser] = await Promise.all([
      userPromise,
      currentUserPromise,
    ]);

    // Handle case where user is not found
    if (!user) {
      notFound();
    }

    return (
      <main aria-labelledby="profile-heading">
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
            transition={{ duration: 0.3 }}
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
          <Suspense fallback={<PostsLoading />}>
            <PostsContainer posts={user.posts} />
          </Suspense>
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error loading profile:", error);
    throw new Error("Failed to load profile data");
  }
}
