"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Card } from "@/components/ui/shadcn/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/shadcn/tabs";
import ArtworkGrid from "@/features/artwork/components/artwork-grid";
import SearchInput from "@/features/search/components/search-input";
import { Artwork, User } from "@prisma/client";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type ArtworkWithUser = Artwork & {
  user: User;
};

export default function ExplorePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("query") || "");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState(searchParams.get("filter") || "all");
  const limit = 24;

  const e = useTranslations("page.explore");
  const c = useTranslations("commons");

  useEffect(() => {
    fetchArtworks();
  }, [page, filter]);

  useEffect(() => {
    // Update URL with current filters
    const params = new URLSearchParams();
    if (query) params.set("query", query);
    if (filter !== "all") params.set("filter", filter);

    const url = `/explore${params.toString() ? `?${params.toString()}` : ""}`;
    router.replace(url);
  }, [query, filter, router]);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      let url = `/api/artworks?page=${page}&limit=${limit}`;

      if (query) {
        url += `&search=${encodeURIComponent(query)}`;
      }

      if (filter === "for-sale") {
        url += "&isForSale=true";
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch artworks");
      const data = await res.json();

      if (page === 1) {
        setArtworks(data);
      } else {
        setArtworks((prev) => [...prev, ...data]);
      }

      setHasMore(data.length === limit);
    } catch (error) {
      console.error("Error fetching artworks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
    setArtworks([]);
    fetchArtworks();
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
    setArtworks([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mx-auto mb-8">
        <h1 className="text-3xl font-bold mb-2">{e("title")}</h1>
        <p className="text-gray-500 mb-6">{e("description")}</p>

        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <SearchInput
              value={query}
              onChange={handleSearch}
              placeholder={e("search-placeholder")}
            />
          </div>
          <div className="flex-shrink-0">
            <Tabs
              value={filter}
              onValueChange={handleFilterChange}
              className="w-full"
            >
              <TabsList>
                <TabsTrigger value="all">{e("filter.all")}</TabsTrigger>
                <TabsTrigger value="for-sale">
                  {e("filter.for-sale")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Results */}
        {loading && artworks.length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
          </div>
        ) : artworks.length === 0 ? (
          <Card className="p-8 text-center">
            <h2 className="text-xl font-medium mb-2">{e("no-artworks")}</h2>
            <p className="text-gray-500">{e("try-different-search")}</p>
          </Card>
        ) : (
          <>
            <ArtworkGrid artworks={artworks} columns={4} gap={20} />

            {hasMore && (
              <div className="mt-8 flex justify-center">
                <Button
                  size="lg"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? c("loading") : c("buttons.load-more")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
