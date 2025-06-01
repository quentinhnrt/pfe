import { siteConfig } from "@/lib/seo/metadata";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  await getTranslations("commons.metadata");

  return {
    title: "Explore Artworks | Artilink",
    description:
      "Discover and explore artworks from talented artists around the world",
    keywords: ["explore", "artworks", "gallery", "artists", "art", "discover"],
    openGraph: {
      title: "Explore Artworks | Artilink",
      description:
        "Discover and explore artworks from talented artists around the world",
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/explore`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Artworks | Artilink",
      description:
        "Discover and explore artworks from talented artists around the world",
    },
    alternates: {
      canonical: `${siteConfig.url}/explore`,
    },
  };
}

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
