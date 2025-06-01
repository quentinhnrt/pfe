import SearchArtist from "@/features/search/components/search-artist";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const m = await getTranslations("commons.metadata");

  return {
    title: m("search"),
  };
}

export default async function SearchPage() {
  const t = await getTranslations("page.search");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>
        <SearchArtist />
      </div>
    </div>
  );
}
