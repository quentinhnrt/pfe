import JsonLd from "@/components/seo/json-ld";
import SearchArtist from "@/features/search/components/search-artist";
import { siteConfig } from "@/lib/seo/metadata";
import { generateBreadcrumbSchema, generateWebSiteSchema } from "@/lib/seo/structured-data";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");

  const title = m("search");
  const description = "Search for artists, artworks and portfolios on ArtiLink";

  return {
    title,
    description,
    keywords: ["search", "artists", "artworks", "portfolios", "gallery", "art"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/search`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/search`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchPage() {
  const t = await getTranslations("page.search");

  const structuredData = [
    generateWebSiteSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Search", url: `${siteConfig.url}/search` },
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">{t("description")}</p>
          </div>
          <SearchArtist />
        </div>
      </div>
    </>
  );
}
