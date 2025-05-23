"use client";
import SearchInput from "@/features/forms/SearchInput";
import { User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";

export default function SearchArtist() {
  const [artists, setArtists] = useState<User[]>([]);
  const [showAll, setShowAll] = useState(false);

  async function handleSearch(query: string) {
    if (query.length < 3) {
      if (artists.length > 0) {
        setArtists([]);
        setShowAll(false);
      }
      return;
    }
    const response = await fetch(`/api/artists?search=${query}`);
    if (!response.ok) {
      console.error("Error fetching artists:", response.statusText);
      return;
    }
    const data = await response.json();
    setArtists(data);
    setShowAll(false);
  }

  const displayedArtists = showAll ? artists : artists.slice(0, 4);

  return (
    <div className="flex flex-col items-center">
      <SearchInput onSearch={handleSearch} />

      {artists.length > 0 && (
        <div className="mt-4 flex items-center space-x-4 overflow-x-auto max-w-full">
          {displayedArtists.map((artist: User) => (
            <Link
              href={`/user/${artist.id}`}
              key={artist.id}
              className="flex items-center gap-2 border-b border-transparent hover:border-white px-3 py-1 transition-colors whitespace-nowrap"
            >
              {artist.image ? (
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image
                    src={artist.image}
                    alt={artist.firstname ?? "Artiste"}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-8 h-8 flex items-center justify-center bg-gray-600 text-white text-xs rounded-full">
                  {artist.firstname ? artist.firstname.charAt(0) : "?"}
                </div>
              )}
              <span>{(artist.firstname ?? "") + " " + (artist.lastname ?? "")}</span>
            </Link>
          ))}

          {!showAll && artists.length > 4 && (
            <button
              onClick={() => setShowAll(true)}
              className="text-sm underline text-blue-400 hover:text-blue-600 whitespace-nowrap"
            >
              Voir plus
            </button>
          )}
        </div>
      )}
    </div>
  );
}
