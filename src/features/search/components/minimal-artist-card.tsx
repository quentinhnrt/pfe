"use client";

import { User } from "@prisma/client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

interface MinimalArtistCardProps {
  artist: User;
  index?: number;
}

export default function MinimalArtistCard({
  artist,
  index = 0,
}: MinimalArtistCardProps) {
  const c = useTranslations("commons");

  return (
    <Link
      href={`/user/${artist.id}`}
      className="group flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-300"
      style={{
        animationDelay: `${index * 50}ms`,
        animationName: "fadeInUp",
        animationDuration: "0.5s",
        animationFillMode: "both",
      }}
    >
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        {artist.image ? (
          <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800 group-hover:border-gray-300 dark:group-hover:border-gray-700 transition-colors">
            <Image
              src={artist.image}
              alt={artist.firstname ?? "Artist"}
              width={48}
              height={48}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300 text-lg font-bold rounded-full border border-gray-100 dark:border-gray-800">
            {artist.firstname?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Informations */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
          {`${artist.firstname ?? ""} ${artist.lastname ?? ""}`.trim() ||
            "Artist"}
        </h3>
        <p className="text-xs text-gray-500 truncate">
          {artist.name ? `@${artist.name}` : c("artist")}
        </p>
      </div>

      <style jsx>{`
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
    </Link>
  );
}
