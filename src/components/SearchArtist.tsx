"use client";
import SearchInput from "@/features/forms/SearchInput";
import { User } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

export default function SearchArtist() {
  const [artists, setArtists] = useState([]);

  async function handleSearch(query: string) {
    if (query.length < 3) {
      if (artists.length > 0) {
        setArtists([]);
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
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="mb-4 text-2xl font-bold">Rechercher un artiste</h1>
      <SearchInput onSearch={handleSearch} />

      {artists.length > 0 && (
        <ul className="mt-4">
          {artists.map((artist: User) => (
            <Link
              href={"/user/" + artist.id}
              key={artist.id}
              className="border-b p-2"
            >
              {artist.firstname} {artist.lastname}
            </Link>
          ))}
        </ul>
      )}
    </div>
  );
}
