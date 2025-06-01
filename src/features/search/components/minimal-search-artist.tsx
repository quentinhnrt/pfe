"use client";

import { Button } from "@/components/ui/shadcn/button";
import SearchInput from "@/features/search/components/search-input";
import { User } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import ArtistSuggestionCard from "./artist-suggestion-card";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export default function MinimalSearchArtist({ value = "", onChange }: Props) {
  const [query, setQuery] = useState(value);
  const [artists, setArtists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const s = useTranslations("feature.search");
  const c = useTranslations("commons");

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!query.trim()) {
      setArtists([]);
      return;
    }

    const fetchArtists = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/artists?search=${encodeURIComponent(query)}`
        );
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        // Limiter à 3 résultats pour les suggestions sur la page d'accueil
        setArtists(data.slice(0, 3));
      } catch (error) {
        console.error("Erreur de recherche :", error);
        setArtists([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArtists();
  }, [query]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?query=${encodeURIComponent(query)}&tab=artists`);
    }
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
          maxWidth="42rem"
        />
      </form>

      {artists.length > 0 && (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {s("titles.artists-results")}
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
          </div>

          <div className="flex overflow-x-auto pb-2 gap-4 scrollbar-hide w-full">
            {artists.map((artist, index) => (
              <div
                key={artist.id}
                className="flex-none w-[calc(33.33%-11px)] min-w-[250px]"
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationName: "fadeInUp",
                  animationDuration: "0.5s",
                  animationFillMode: "both",
                }}
              >
                <ArtistSuggestionCard artist={artist} index={index} />
              </div>
            ))}
          </div>

          {artists.length === 3 && (
            <div className="flex justify-center mt-4">
              <Button variant="default" className="rounded-xl" asChild>
                <Link
                  href={`/search?query=${encodeURIComponent(query)}&tab=artists`}
                  className="group flex items-center gap-2"
                >
                  <span>{c("buttons.see-more")}</span>
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </Button>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="mt-4 text-center text-gray-500">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
          <span className="text-xs">{s("loading")}</span>
        </div>
      )}

      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
