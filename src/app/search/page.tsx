import JsonLd from "@/components/seo/json-ld";
import SearchTabs from "@/features/search/components/search-tabs";
import { siteConfig } from "@/lib/seo/metadata";
import {
  generateBreadcrumbSchema,
  generateWebSiteSchema,
} from "@/lib/seo/structured-data";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { query?: string; tab?: string };
}): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");
  const s = await getTranslations("feature.search");
  const query = searchParams?.query;
  const tab = searchParams?.tab || "artists";

  const title = query ? `${m("search")}: ${query} (${tab})` : m("search");
  const description = query
    ? `${s("metadata.results-for")} ${query} - ${tab === "artists" ? s("tabs.artists") : s("tabs.artworks")} ${s("metadata.on-artilink")}`
    : s("metadata.description");

  return {
    title,
    description,
    keywords: ["search", "artists", "artworks", "portfolios", "gallery", "art"],
    openGraph: {
      title,
      description,
      type: "website",
      locale: "en_US",
      url: `${siteConfig.url}/search${query ? `?query=${query}&tab=${tab}` : ""}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `${siteConfig.url}/search${query ? `?query=${query}&tab=${tab}` : ""}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: { query?: string; tab?: string };
}) {
  const t = await getTranslations("page.search");
  const query = searchParams?.query || "";
  const tab = searchParams?.tab || "artists";

  const structuredData = [
    generateWebSiteSchema(),
    generateBreadcrumbSchema([
      { name: "Home", url: siteConfig.url },
      { name: "Search", url: `${siteConfig.url}/search` },
      ...(query
        ? [
            {
              name: `Results for "${query}" (${tab})`,
              url: `${siteConfig.url}/search?query=${query}&tab=${tab}`,
            },
          ]
        : []),
    ]),
  ];

  return (
    <>
      <JsonLd data={structuredData} />
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
            <p className="text-muted-foreground">
              {query ? t("results-for", { query }) : t("description")}
            </p>
          </div>
          <SearchTabs initialTab={tab} query={query} key={`${tab}-${query}`} />
        </div>
      </div>
    </>
  );
}
