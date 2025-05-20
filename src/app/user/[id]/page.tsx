import type { Metadata } from "next";

import { ProfileHeader } from "@/features/profile/profile-header";
import { getCurrentUser, getUserById } from "@/lib/users";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View user profile and posts",
};

export default async function ProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const [userData, currentUserData] = await Promise.all([
    getUserById(id),
    getCurrentUser(),
  ]);

  if (!userData) {
    notFound();
  }

  const profile = {
    id: userData.id,
    name: `${userData.firstname} ${userData.lastname}`,
    username: userData.name || "",
    avatar: userData.image || "/avatar-placeholder.svg",
    coverImage: userData.bannerImage || "/banner-placeholder.svg",
    bio: userData.bio || "",
    location: userData.location || "",
    website: userData.website || "",
    followers: userData.followers?.length || 0,
    following: userData.following?.length || 0,
    joined: new Date(userData.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    }),
  };

  const isOwnProfile = currentUserData?.id === userData.id;

  return (
    <div className="container mx-auto">
      <ProfileHeader profile={profile} isOwnProfile={isOwnProfile} />
    </div>
  );
}
