"use client";

import { Button } from "@/components/ui/shadcn/button";
import ArtworkGrid from "@/features/artwork/components/artwork-grid";
import { Artwork, User } from "@prisma/client";
import { useEffect, useState } from "react";

type ArtworkWithUser = Artwork & {
  user: User;
};

export default function ArtworksToSellTab({
  userId,
  isActive,
}: {
  userId: string;
  isActive: boolean;
}) {
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  const limit = 12;

  async function fetchArtworks() {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/artworks?userId=${userId}&page=${page}&limit=${limit}&isForSale=true`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch artworks");
      }

      const result: ArtworkWithUser[] = await response.json();

      if (page === 1) {
        setArtworks(result);
      } else {
        setArtworks((prev) => [...prev, ...result]);
      }

      setHasMore(result.length === limit);
      if (!hasFetched) {
        setHasFetched(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!hasFetched || !isActive) return;
    fetchArtworks();
  }, [page, limit]);

  useEffect(() => {
    if (!isActive || hasFetched) return;
    fetchArtworks();
  }, [isActive, userId]);

  if (error) {
    return (
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Artworks</h2>
        <div className="text-red-500">
          Erreur lors du chargement des artworks: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      {isLoading && page === 1 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <ArtworkGrid artworks={artworks} columns={3} gap={16} />

          {artworks.length === 0 && (
            <p className="text-gray-500 text-center">Aucune œuvre à vendre</p>
          )}

          {hasMore && (
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              disabled={isLoading}
              className="cursor-pointer mx-auto block mt-8"
            >
              {isLoading ? "Chargement..." : "Charger plus"}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
