"use client";

import { Button } from "@/components/ui/shadcn/button";
import ArtworkCard from "@/features/artwork/components/artwork-card";
import ArtworkDetailsDialog from "@/features/artwork/components/artwork-details-dialog";
import NotFound from "@/features/common/not-found";
import SearchInput from "@/features/search/components/search-input";
import { Artwork, User } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type ArtworkWithUser = Artwork & {
  user: User;
};

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function SearchArtwork({ value = "", onChange }: Props) {
  const [query, setQuery] = useState(value);
  const [artworks, setArtworks] = useState<ArtworkWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedArtwork, setSelectedArtwork] =
    useState<ArtworkWithUser | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const s = useTranslations("feature.search");
  const c = useTranslations("commons");

  // Déterminer si on est sur la page de recherche
  const isSearchPage = pathname === "/search";

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!query.trim()) {
      setArtworks([]);
      return;
    }

    const fetchArtworks = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/artworks?search=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch artworks");
        const data = await res.json();
        // Limiter à 3 résultats pour les suggestions, mais afficher plus sur la page de recherche
        setArtworks(isSearchPage ? data : data.slice(0, 3));
      } catch (error) {
        console.error("Erreur de recherche :", error);
        setArtworks([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtworks();
  }, [query, isSearchPage]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}&tab=artworks`);
    }
  };

  const handleArtworkClick = (artwork: ArtworkWithUser) => {
    setSelectedArtwork(artwork);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <form onSubmit={handleSubmit} className="relative w-full">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            onChange?.(v);
          }}
          placeholder={s("placeholders.artworks")}
          maxWidth="42rem"
        />
      </form>

      {artworks.length > 0 && (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-medium ">
              {s("titles.artworks-results")}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
          </div>

          <div
            className={`grid gap-4 px-2 ${isSearchPage ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}
          >
            {artworks.map((artwork, index) => (
              <div
                key={artwork.id}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationName: "fadeInUp",
                  animationDuration: "0.5s",
                  animationFillMode: "both",
                }}
              >
                <ArtworkCard artwork={artwork} onClick={handleArtworkClick} />
              </div>
            ))}
          </div>

          {!isSearchPage && artworks.length === 3 && (
            <div className="flex justify-center mt-4">
              <Button variant={"default"} className={"rounded-2xl p-0"}>
                <Link
                  href={`/search?query=${encodeURIComponent(query)}&tab=artworks`}
                  className="group flex items-center gap-2 transition-all duration-300 w-full h-full p-6"
                >
                  <span className="text-sm font-medium ">
                    {c("buttons.see-more")}
                  </span>
                  <div className="flex items-center justify-center w-6 h-6 transition-all duration-300">
                    <ChevronRight
                      size={14}
                      className="text-gray-600 group-hover:text-gray-700"
                    />
                  </div>
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="mt-8 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400 mr-2"></div>
          <span>{s("loading")}</span>
        </div>
      )}

      {/* Afficher le message "non trouvé" uniquement sur la page de recherche */}
      {!isLoading && isSearchPage && query.trim() && artworks.length === 0 && (
        <div className="mt-8 w-full">
          <NotFound
            searchQuery={query}
            description={s("no-results-artworks")}
            showBackButton={false}
            showHomeButton={false}
          />
        </div>
      )}

      <ArtworkDetailsDialog
        artwork={selectedArtwork}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
