import { Badge } from "@/components/ui/shadcn/badge";
import { Separator } from "@/components/ui/shadcn/separator";
import ArtworkFeed from "@/features/feed/components/artwork-feed";
import PostFeed from "@/features/feed/components/post-feed";
import SearchArtist from "@/features/search/components/search-artist";
import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");

  return {
    title: m("homepage"),
    description: m("homepage-description"),
  };
}

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const t = await getTranslations("page.index");
  const c = await getTranslations("commons");
  return (
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
  );
}
