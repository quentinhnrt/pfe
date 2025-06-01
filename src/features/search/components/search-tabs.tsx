"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/shadcn/tabs";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SearchArtist from "./search-artist";
import SearchArtwork from "./search-artwork";

type SearchTabsProps = {
  initialTab?: string;
  query?: string;
};

export default function SearchTabs({
  initialTab = "artists",
  query = "",
}: SearchTabsProps) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const searchParams = useSearchParams();
  const router = useRouter();
  const s = useTranslations("feature.search.tabs");

  // Synchroniser avec les paramètres d'URL
  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && (tabFromUrl === "artists" || tabFromUrl === "artworks")) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);

    // Mettre à jour l'URL avec le nouvel onglet actif
    const currentQuery = searchParams.get("query") || "";
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);

    if (currentQuery) {
      url.searchParams.set("query", currentQuery);
    } else {
      url.searchParams.delete("query");
    }

    router.replace(url.pathname + url.search);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="flex justify-center mb-6">
        <TabsList>
          <TabsTrigger value="artists" className="px-8">
            {s("artists")}
          </TabsTrigger>
          <TabsTrigger value="artworks" className="px-8">
            {s("artworks")}
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="artists">
        <SearchArtist value={query} key={`artists-${query}`} />
      </TabsContent>

      <TabsContent value="artworks">
        <SearchArtwork value={query} key={`artworks-${query}`} />
      </TabsContent>
    </Tabs>
  );
}
