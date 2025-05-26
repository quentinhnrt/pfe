"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User } from "@prisma/client";
import SearchInput from "@/features/forms/SearchInput";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
  disableSuggestions?: boolean;
};

export default function SearchArtist({ value = "", onChange, disableSuggestions }: Props) {
  const [query, setQuery] = useState(value);
  const [artists, setArtists] = useState<User[]>([]);
  const pathname = usePathname();

  const suggestionsDisabled = disableSuggestions || pathname === "/search";

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (suggestionsDisabled || !query.trim()) {
      setArtists([]);
      return;
    }

    const fetchArtists = async () => {
      try {
        const res = await fetch(`/api/artists?search=${encodeURIComponent(query)}`);
        if (!res.ok) throw new Error("Failed to fetch artists");
        const data = await res.json();
        setArtists(data.slice(0, 3));
      } catch (error) {
        console.error("Erreur de recherche :", error);
        setArtists([]);
      }
    };

    fetchArtists();
  }, [query, suggestionsDisabled]);

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
      <div className="relative w-full">
        <SearchInput
          value={query}
          onChange={(v) => {
            setQuery(v);
            onChange?.(v);
          }}
        />
      </div>

      {!suggestionsDisabled && artists.length > 0 && (
        <div className="mt-6 w-full">
          <div className="flex items-center justify-between mb-4 px-2">
            <h3 className="text-sm font-medium text-gray-600">
              Artistes suggérés
            </h3>
            <div className="h-px flex-1 bg-gradient-to-r from-gray-300 to-transparent ml-4"></div>
          </div>
          <div className="flex items-center gap-4 justify-center px-2">
            {artists.map((artist, index) => (
              <Link
                href={`/user/${artist.id}`}
                key={artist.id}
                className="group flex-shrink-0 flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 hover:border-gray-300 hover:shadow-lg transition-all duration-300 min-w-fit"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative">
                  {artist.image ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                      <Image
                        src={artist.image}
                        alt={artist.firstname ?? "Artiste"}
                        width={40}
                        height={40}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-100 text-gray-700 text-sm font-bold rounded-full border-2 border-gray-200 group-hover:border-gray-300 transition-colors duration-300">
                      {artist.firstname?.charAt(0) || "?"}
                    </div>
                  )}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-gray-900 font-medium text-sm group-hover:text-black transition-colors duration-300 truncate">
                    {`${artist.firstname ?? ""} ${artist.lastname ?? ""}`.trim() || "Artiste"}
                  </span>
                  <span className="text-gray-500 text-xs group-hover:text-gray-600 transition-colors duration-300">
                    Artiste
                  </span>
                </div>
                <ChevronRight 
                  size={16} 
                  className="text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5" 
                />
              </Link>
            ))}
            {artists.length === 3 && (
              <Link
                href={`/search?query=${encodeURIComponent(query)}`}
                className="group flex-shrink-0 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 hover:border-gray-300 hover:bg-gray-100 hover:shadow-lg transition-all duration-300 min-w-fit"
              >
                <span className="text-gray-700 text-sm font-medium group-hover:text-gray-900 transition-colors duration-300">
                  Voir plus
                </span>
                <div className="flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full group-hover:bg-gray-300 transition-all duration-300">
                  <ChevronRight size={14} className="text-gray-600 group-hover:text-gray-700" />
                </div>
              </Link>
            )}
          </div>
        </div>
      )}

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
      `}</style>
    </div>
  );
}