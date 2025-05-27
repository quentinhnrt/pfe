"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import SearchArtist from "@/components/SearchArtist";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [artists, setArtists] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 1) {
      setIsLoading(true);
      fetch(`/api/artists?search=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setArtists(data);
          setIsLoading(false);
        })
        .catch(() => {
          setArtists([]);
          setIsLoading(false);
        });
    } else {
      setArtists([]);
      setIsLoading(false);
    }

    router.replace(`/search?query=${encodeURIComponent(query)}`, { scroll: false });
  }, [query, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-gray-200/30 to-gray-300/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-black/5 to-gray-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-gray-100/20 to-gray-200/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent mb-4 animate-gradient-x">
              Découvrez des artistes
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Et connectez-vous avec des talents exceptionnels
            </p>
          </div>
          <div className="max-w-2xl mx-auto mb-12">
            <SearchArtist
              value={query}
              onChange={(value) => setQuery(value)}
              disableSuggestions={true}
            />
          </div>
          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin"></div>
                <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-black rounded-full animate-spin"></div>
              </div>
            </div>
          )}
          {artists.length > 0 ? (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in-up">
              {artists.map((artist, index) => (
                <Link
                  href={`/user/${artist.id}`}
                  key={artist.id}
                  className="group relative transform transition-all duration-500 hover:scale-105 hover:-translate-y-2"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="relative bg-white/70 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-xl group-hover:shadow-2xl transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-gray-900/0 group-hover:from-black/5 group-hover:to-gray-900/10 transition-all duration-500 z-10"></div>
                    <div className="relative h-32 w-full overflow-hidden">
                      {artist.bannerImage ? (
                        <Image
                          src={artist.bannerImage}
                          alt="Bannière"
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center transition-transform duration-700 group-hover:scale-110">
                          <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="relative z-20 p-6">
                      <div className="flex items-center gap-4 mb-4">
                        {artist.image ? (
                          <Image
                            src={artist.image}
                            alt={`${artist.firstname ?? ""} ${artist.lastname ?? ""}`}
                            width={56}
                            height={56}
                            className="rounded-full"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-gradient-to-br from-gray-800 to-black text-white flex items-center justify-center rounded-full text-lg font-semibold shadow-lg">
                            {artist.firstname?.charAt(0) ?? "?"}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-lg text-gray-800 font-bold">
                            {(artist.firstname ?? "") + " " + (artist.lastname ?? "")}
                          </h3>
                          <div className="w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-gray-800 to-gray-400 transition-all duration-500 mt-1"></div>
                        </div>
                      </div>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="bg-gradient-to-r bg-black text-white text-xs px-3 py-1 rounded-full font-medium">
                          Voir le profil →
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : query.length >= 1 && !isLoading ? (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">Aucun artiste trouvé</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Essayez avec d&apos;autres mots-clés ou explorez nos suggestions ci-dessous
              </p>
            </div>
          ) : (
            <div className="text-center py-20 animate-fade-in">
              <div className="w-32 h-32 mx-auto mb-8 bg-gray-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold text-black mb-4">
                Recherchez un artiste
              </h3>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
