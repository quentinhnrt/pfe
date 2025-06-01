import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import JsonLd from "@/components/seo/json-ld";
import ArtworkFeed from "@/features/feed/components/artwork-feed";
import PostFeed from "@/features/feed/components/post-feed";
import SearchArtist from "@/features/search/components/search-artist";
import { auth } from "@/lib/auth";
import { siteConfig } from "@/lib/seo/metadata";
import { generateOrganizationSchema, generateWebSiteSchema, generateBreadcrumbSchema } from "@/lib/seo/structured-data";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");

  return {
    title: m("homepage"),
    description: m("homepage-description"),
    keywords: siteConfig.keywords,
    openGraph: {
      title: m("homepage"),
      description: m("homepage-description"),
      type: "website",
      locale: "en_US",
      url: siteConfig.url,
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title: m("homepage"),
      description: m("homepage-description"),
      creator: siteConfig.creator,
    },
    alternates: {
      canonical: siteConfig.url,
    },
  };
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("page.index");
  const c = await getTranslations("commons");
  
  return (
    <>
      <JsonLd 
        data={[
          generateOrganizationSchema(),
          generateWebSiteSchema(),
          generateBreadcrumbSchema([
            { name: "Home", url: siteConfig.url }
          ])
        ]} 
      />
      <div className="min-h-screen">
      <div className="py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">{t("description")}</p>
          <SearchArtist />
        </div>
      </div>
      <main className="container mx-auto px-4">
        <ArtworkFeed isAuthenticated={!!session?.user} />
        {session?.user && (
          <div className="relative py-10">
            <Separator className={"dark:bg-white bg-gray-200"} />
            <Badge
              className={
                "absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full font-semibold px-6 py-2  dark:text-white text-gray-600 border-1 dark:border-white border-gray-200 dark:bg-black bg-white text-sm"
              }
            >
              {t("last-posts")}
            </Badge>
          </div>
        )}
        {session?.user && (
          <PostFeed
            session={{
              user: {
                id: session.user.id,
                firstname: session.user.firstname || c("User"),
                image: session.user.image ?? undefined,
              },
            }}
          />
        )}
      </main>
    </div>
    </>
  );
}
