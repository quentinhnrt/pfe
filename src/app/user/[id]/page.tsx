import { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProfileHeader } from "@/features/profile/components/profile-header";
import ProfileTabs from "@/features/profile/components/profile-tabs";
import { getCurrentUser, getUserById } from "@/lib/users";
import { formatDateToLocale } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");

  return {
    title: m("user-profile"),
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const c = await getTranslations("commons");
  const { id } = await params;

  // Parallel data fetching for better performance
  const [userData, currentUserData] = await Promise.all([
    getUserById(id).catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  if (!userData) {
    notFound();
  }

  const fullName = [userData.firstname, userData.lastname]
    .filter(Boolean)
    .join(" ");

  const profile = {
    id: userData.id,
    name: fullName || userData.name || c("anonymous-user"),
    username: userData.name || "",
    avatar: userData.image || "/avatar-placeholder.svg",
    coverImage: userData.bannerImage || "/banner-placeholder.svg",
    bio: userData.bio || "",
    location: userData.location || "",
    website: userData.website || "",
    followers: userData.followers?.length || 0,
    following: userData.following?.length || 0,
    joined: formatDateToLocale(userData.createdAt, {
      month: "long",
      year: "numeric",
    }),
    hasPortfolio:
      Array.isArray(userData.user_template) &&
      userData.user_template.length > 0,
  };

  const isOwnProfile = currentUserData?.id === userData.id;

  return (
    <main className="container mx-auto">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        user={userData}
        currentUser={currentUserData}
      />
      <ProfileTabs userId={id} />
    </main>
  );
}
