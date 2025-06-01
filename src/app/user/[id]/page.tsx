import { Metadata } from "next";
import { notFound } from "next/navigation";

import JsonLd from "@/components/seo/json-ld";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import ProfileTabs from "@/features/profile/components/profile-tabs";
import { siteConfig } from "@/lib/seo/metadata";
import { generatePersonSchema, generateProfilePageSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { getCurrentUser, getUserById } from "@/lib/users";
import { formatDateToLocale } from "@/lib/utils";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const [m, userData] = await Promise.all([
    getTranslations("commons.metadata"),
    getUserById(id).catch(() => null),
  ]);

  if (!userData) {
    return {
      title: m("user-profile"),
      robots: "noindex",
    };
  }

  const fullName = [userData.firstname, userData.lastname]
    .filter(Boolean)
    .join(" ") || userData.name || "ArtiLink User";

  const title = `${fullName} - ${m("user-profile")}`;
  const description = userData.bio || `Discover ${fullName}'s profile on ArtiLink`;
  const url = `${siteConfig.url}/user/${id}`;

  return {
    title,
    description,
    keywords: [
      fullName,
      "artist",
      "portfolio",
      "artwork",
      userData.role === "ARTIST" ? "professional artist" : "collector",
    ],
    openGraph: {
      title,
      description,
      type: "profile",
      locale: "en_US",
      url,
      siteName: siteConfig.name,
      images: userData.image ? [{
        url: userData.image,
        width: 1200,
        height: 630,
        alt: fullName,
      }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: userData.image ? [userData.image] : undefined,
    },
    alternates: {
      canonical: url,
    },
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

  const structuredData = [
    generatePersonSchema({
      id: userData.id,
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      username: userData.name || undefined,
      bio: userData.bio || undefined,
      image: userData.image || undefined,
      accountType: userData.role,
    }),
    generateProfilePageSchema({
      id: userData.id,
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      username: userData.name || undefined,
      bio: userData.bio || undefined,
      image: userData.image || undefined,
      accountType: userData.role,
      artworksCount: 0,
      followersCount: userData.followers?.length || 0,
    }),
    generateBreadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Profiles", url: `${siteConfig.url}/search` },
      { name: fullName || "Profile", url: `${siteConfig.url}/user/${id}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <main className="container mx-auto">
        <ProfileHeader
          profile={profile}
          isOwnProfile={isOwnProfile}
          user={userData}
          currentUser={currentUserData}
        />
        <ProfileTabs userId={id} />
      </main>
    </>
  );
}
