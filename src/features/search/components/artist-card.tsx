"use client";

import { User } from "@prisma/client";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface ArtistCardProps {
  artist: User;
  index?: number;
  showArrow?: boolean;
}

export default function ArtistCard({
  artist,
  index = 0,
  showArrow = true,
}: ArtistCardProps) {
  const c = useTranslations("commons");

  return (
    <Link
      href={`/user/${artist.id}`}
      className="group flex flex-col bg-white dark:bg-black border dark:border-white/20 border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-lg transition-all duration-300 h-full"
      style={{
        animationDelay: `${index * 50}ms`,
        animationName: "fadeInUp",
        animationDuration: "0.5s",
        animationFillMode: "both",
      }}
    >
      {/* Bannière */}
      <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
        {artist.bannerImage && (
          <Image
            src={artist.bannerImage}
            alt={`${artist.firstname || "Artist's banner"}`}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Contenu */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start">
          {/* Avatar */}
          <div className="relative -mt-10 mr-3">
            {artist.image ? (
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-black bg-white dark:bg-black">
                <Image
                  src={artist.image}
                  alt={artist.firstname ?? "Artist"}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="w-16 h-16 flex items-center justify-center bg-gray-100 text-gray-700 text-lg font-bold rounded-full border-4 border-white dark:border-black">
                {artist.firstname?.charAt(0) || "?"}
              </div>
            )}
          </div>

          {/* Nom et détails */}
          <div className="flex-1 pt-3">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-black transition-colors duration-300">
              {`${artist.firstname ?? ""} ${artist.lastname ?? ""}`.trim() ||
                "Artist"}
            </h3>
            <p className="text-sm text-gray-500">
              {artist.name ? `@${artist.name}` : c("artist")}
            </p>
          </div>

          {/* Flèche */}
          {showArrow && (
            <ChevronRight
              size={18}
              className="text-gray-400 group-hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-0.5 mt-4"
            />
          )}
        </div>
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </Link>
  );
}
