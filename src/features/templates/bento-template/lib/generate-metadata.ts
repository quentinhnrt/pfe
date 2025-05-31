import { templateSchema } from "@/features/templates/bento-template/settings";
import { getServerUrl } from "@/lib/server-url";
import { User } from "@prisma/client";
import type { Metadata } from "next";
import { z } from "zod";

export function generatePortfolioMetadata(
  user: User,
  template: z.infer<typeof templateSchema>
): Metadata {
  const fullName =
    [user.firstname, user.lastname].filter(Boolean).join(" ") ||
    user.name ||
    "Utilisateur";

  const baseUrl = getServerUrl() || "";

  const profileUrl = `${baseUrl}/portfolio/${encodeURIComponent(user.name || fullName)}`;

  const profileImage =
    user.bannerImage || user.image || `${baseUrl}/default-banner.jpg`;

  const description =
    template.description ||
    user.bio ||
    `Portfolio de ${fullName} – Découvrez ses collections, inspirations et créations.`;

  const twitterHandle = template.contactInfos?.twitter
    ? `@${template.contactInfos.twitter.split("/").pop()}`
    : undefined;

  return {
    title: `${fullName} | Portfolio`,
    description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: profileUrl,
    },
    openGraph: {
      title: `${fullName} | Portfolio`,
      description,
      url: profileUrl,
      type: "profile",
      images: [
        {
          url: profileImage,
          width: 1200,
          height: 630,
          alt: `Image de profil de ${fullName}`,
        },
      ],
      locale: "fr_FR",
      siteName: "ArtiLink",
    },
    twitter: {
      card: "summary_large_image",
      title: `${fullName} | Portfolio`,
      description,
      images: [profileImage],
      creator: twitterHandle,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
